const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema (simplified version for script)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  workbooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workbook' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createDemoUser() {
  try {
    // Connect to MongoDB using the connection string from .env.local
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/falling-upward');
    console.log('Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@example.com' });
    
    if (existingUser) {
      console.log('Demo user already exists!');
      console.log('Email: demo@example.com');
      console.log('Password: demo123');
      return;
    }

    // Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo123',
      role: 'user'
    });

    await demoUser.save();
    console.log('✅ Demo user created successfully!');
    console.log('📧 Email: demo@example.com');
    console.log('🔑 Password: demo123');
    console.log('🎯 Role: user');
    
  } catch (error) {
    console.error('❌ Error creating demo user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createDemoUser();
