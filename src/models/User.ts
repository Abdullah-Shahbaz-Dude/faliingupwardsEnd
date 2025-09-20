import mongoose, { Schema, model, models, Document, Types } from "mongoose";

// TypeScript interface
interface IUser extends Document {
  _id: Types.ObjectId; // Add _id
  name: string;
  email: string;
  accessToken?: string;
  workbooks: Types.ObjectId[];
  role: "user" | "admin";
  isCompleted?: boolean;
  completedAt?: Date;
  dashboardExpired?: boolean;
  linkExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number; // Add __v
}

// Re-export type
export type { IUser };

// Schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    accessToken: {
      type: String,
    },
    workbooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Workbook",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    dashboardExpired: {
      type: Boolean,
      default: false,
    },
    linkExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from creation
    },
  },
  { timestamps: true }
);

// PERFORMANCE INDEXES - Based on actual query patterns in codebase
// Note: email already has unique index from schema definition

// 1. Admin dashboard filtering and user management
userSchema.index({ role: 1 });
userSchema.index({ isCompleted: 1 });
userSchema.index({ dashboardExpired: 1 });

// 2. User access validation and expiration checks
userSchema.index({ linkExpiresAt: 1 });

// 3. Admin dashboard compound queries for filtering
userSchema.index({ role: 1, isCompleted: 1 });
userSchema.index({ dashboardExpired: 1, linkExpiresAt: 1 });

// 4. Sorting and pagination
userSchema.index({ createdAt: 1 });
userSchema.index({ updatedAt: 1 });

// 5. Workbook assignment queries (array field)
userSchema.index({ workbooks: 1 });

const User = models.User || model<IUser>("User", userSchema);

export default User;
