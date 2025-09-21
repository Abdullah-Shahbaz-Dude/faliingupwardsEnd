import mongoose, { Document } from "mongoose";

// 🔒 SECURITY: Use environment variable instead of hardcoded credentials
const MONGO_URI = process.env.MONGODB_URI || (() => {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
})();

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// Flexible user schema
interface IUser extends Document {
  email?: string;
  role?: string;
  [key: string]: any;
}

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model<IUser>("User", userSchema, "users");

async function makeAdmin() {
  const res = await User.updateOne(
    { email: "admin@gmail.com" }, // change email if needed
    { $set: { role: "admin" } }
  );
  console.log(res);
  mongoose.disconnect();
}

makeAdmin();
