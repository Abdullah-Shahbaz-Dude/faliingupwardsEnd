const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

// Admin schema matching src/models/Admin.ts
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: "admin" },
  accessToken: String,
  workbooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workbook" }],
});

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // ⚠️ CHANGE THESE TO YOUR DESIRED CREDENTIALS ⚠️
    const adminEmail = "admin@fallingupward.com"; // CHANGE THIS
    const adminPassword = "Admin@123456"; // CHANGE THIS

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`👤 Role: ${existingAdmin.role}`);

      // Update role to admin if not already
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("✅ Updated user role to admin");
      }
      return;
    }

    // Create new admin
    const admin = new Admin({
      email: adminEmail,
      password: adminPassword, // Will be auto-hashed by pre-save hook
      role: "admin",
      workbooks: [],
    });

    await admin.save();

    console.log("\n🎉 Admin user created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("👤 Role: admin");
    console.log("\n⚠️  IMPORTANT: Save these credentials securely!");
    console.log("🔗 Login at: http://localhost:3000/login");
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

createAdmin();
