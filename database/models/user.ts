import { Schema, model, Types } from "mongoose";

interface User {
  name: string;
  password: string;
  email: string;
  somethingAboutYou?: string;
  favorite?: Array<string>;
  yourRoutes?: Object;
}

const userSchema: Schema<User> = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  somethingAboutYou: { type: String },
  favorite: { type: [Types.ObjectId] },
  yourRoutes: { type: { type: Schema.Types.ObjectId, ref: "hiking" } },
});

const UserModel = model<User>("user", userSchema, "users");

export default UserModel;
