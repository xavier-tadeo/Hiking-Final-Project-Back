import { Schema, model, Types } from "mongoose";

interface User {
  name: string;
  password: string;
  email: string;
  somethingAboutYou?: string;
  favorite?: Array<string>;
  yourRoutes?: Array<string>;
}

const userSchema: Schema = new Schema<User>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  somethingAboutYou: { type: String },
  favorite: { type: [Types.ObjectId] },
  yourRoutes: { types: [Types.ObjectId] },
});

const UserModel = model<User>("user", userSchema, "users");
