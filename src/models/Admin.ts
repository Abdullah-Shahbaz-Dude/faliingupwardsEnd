import mongoose, { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Extend Document to include _id
export interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId; // Add _id for Mongoose
  email: string;
  password: string;
  role: string;
  accessToken?: string;
  workbooks?: mongoose.Types.ObjectId[]; // Use ObjectId[] instead of string[]
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: "admin" },
  accessToken: String,
  workbooks: [{ type: Schema.Types.ObjectId, ref: "Workbook" }],
});

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  if (!this.password) throw new Error("Password not set");
  return await bcrypt.compare(candidatePassword, this.password);
};

export default models.Admin || model<IAdmin>("Admin", adminSchema);
