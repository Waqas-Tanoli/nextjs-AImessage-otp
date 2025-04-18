import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          Success: false,
          message: "user not found!",
        },
        {
          status: 404,
        }
      );
    }

    //checking if user is accepting messages

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          Success: false,
          message: "This user is not accepting messages!",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.message.push(newMessage as Message);

    await user.save();
    return Response.json(
      {
        Success: true,
        message: "Message sent successfully!",
      },
      {
        status: 401,
      }
    );
  } catch (error) {
    console.log("Error adding messages", error);
    return Response.json(
      {
        Success: false,
        message: "Internal server error!",
      },
      {
        status: 500,
      }
    );
  }
}
