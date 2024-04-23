import { removeUserCache } from "@/services/userService";
import mongoose from "mongoose";

type ObjectId = mongoose.Types.ObjectId | string;

export interface IUser {
  name: string;
  email: string;
  picture?: string;
  authProvider: string;
  providerId: string;
  twitchToken?: string;
}
export interface MUser extends IUser {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: false,
    },
    authProvider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.post("findOneAndUpdate", function (doc: MUser, next) {
  removeUserCache(doc.providerId);
  next();
});

userSchema.post("findOneAndDelete", function (doc: MUser, next) {
  removeUserCache(doc.providerId);
  next();
});

userSchema.index({ providerId: 1, authProvider: 1 });

const User = mongoose.model<MUser>("User", userSchema);
export default User;
