import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  accessToken?: string;
  workbooks: Types.ObjectId[];
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
