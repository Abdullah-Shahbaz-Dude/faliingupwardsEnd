import mongoose, { Document } from "mongoose";

const MONGO_URI =
  "mongodb+srv://shahbazabdullah72:shahbazabdullah72@cluster0.w0oklxs.mongodb.net/WorkBooks";

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
