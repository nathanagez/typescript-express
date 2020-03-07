import { MongooseDocument } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  _id: string;
}
