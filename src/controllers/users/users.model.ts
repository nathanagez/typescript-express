import * as mongoose from "mongoose";
import { IUser } from "@interfaces/user.interface";

const UserSchema = new mongoose.Schema<IUser>({
  username: String,
  email: String,
  password: String
});

const UserModel = mongoose.model<IUser & mongoose.Document>("User", UserSchema);

export { UserModel };
