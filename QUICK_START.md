# 🚀 Quick Start - New Database Setup

## What This Does

This setup migrates your application to a new MongoDB database with:

- ✅ 28 Workbook Templates
- ✅ Admin User Account
- ✅ Database Indexes

---

## 🎯 ONE-TIME SETUP (3 Minutes)

### Before You Start

1. Make sure `.env.local` exists with your new MongoDB connection string:

   ```
   MONGODB_URI=mongodb+srv://your-new-connection-string
   ```

2. Edit `scripts/createAdmin.js` (lines 27-28) with your admin credentials:
   ```javascript
   const adminEmail = "your-email@example.com";
   const adminPassword = "YourSecurePassword123";
   ```

---

## ⚡ Run These Commands

Copy and paste these commands one by one:

```bash
# Step 1: Import workbook templates
node scripts/importMasterTemplates.js

# Step 2: Create admin account
node scripts/createAdmin.js

# Step 3: Create database indexes
npm run create-indexes

# Step 4: Start application
npm run dev
```

---

## 🔐 Login

After setup:

- Open: http://localhost:3000/login
- Enter the email/password you set in `createAdmin.js`
- Access admin dashboard

---

## ✅ Done!

Your new database is now ready with:

- 28 workbook templates
- Admin account
- Optimized indexes
- Full functionality

---

## 📊 Summary of Changes

**New Files Created:**

- `scripts/createAdmin.js` - Script to create admin users
- `MIGRATION_GUIDE.md` - Detailed migration instructions
- `QUICK_START.md` - This file

**Existing Files:** ✅ NOT MODIFIED

- All your existing code remains unchanged
- All models, authentication, and business logic intact
- Only added new helper scripts

---

## 🔄 Re-running Scripts

**Safe to run multiple times:**

- `importMasterTemplates.js` - Skips existing templates
- `createAdmin.js` - Skips if admin exists
- `create-indexes` - Updates indexes safely

**Your data is protected** - Scripts check before creating duplicates.





