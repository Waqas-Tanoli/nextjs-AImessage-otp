import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || session.user) {
    return Response.json(
      {
        Success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    //aggregation pipelines
    const user = await UserModel.aggregate([
      { $match: { id: userId } }, //this will match the id with user _id.
      { $unwind: "messages" }, //this will unwind the array. create multiple objects and it helps to sort the array and other operations gets easy.
      { $sort: { "messages.createdAt": -1 } }, //this will sort the array , sort message field by createdAt
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }, //after performing all the above operations, we group all the documents and push all the messages into messages array.
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          Success: false,
          message: "user not found!",
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
      {
        Success: true,
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error getting messages", error);
    return Response.json(
      {
        Success: false,
        message: "Error getting messages!",
      },
      {
        status: 500,
      }
    );
  }
}
