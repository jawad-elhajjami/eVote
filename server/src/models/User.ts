import { Schema, model, Document } from "mongoose";

// TypeScript interface for the user object
export interface IUser extends Document {
  username: string;
  password: string;
  roles: string[];
  publicKey: String;
  dateCreated: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["voter"],
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  publicKey: {
    type: String,
  },
});

export default model<IUser>("User", userSchema);
