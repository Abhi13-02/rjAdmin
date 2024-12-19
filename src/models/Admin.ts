import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  image?: string;
  password:string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password :{type: String, required: true},
    image: { type: String }, // Optional field to store profile picture URL
    isAdmin: { type: Boolean, default: false }, // Default to non-admin Admins
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Export the Admin model
export default mongoose.models?.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
