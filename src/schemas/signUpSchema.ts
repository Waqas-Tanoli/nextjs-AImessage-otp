import { z } from "zod";
export const usernameValidation = z
  .string()
  .min(2, "user name must be atleat 2 characters")
  .max(20, "usrname must not be longer than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "User name must not contain special characters.");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid Email!" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
