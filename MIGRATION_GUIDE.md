# 🚀 MongoDB Database Migration Guide

## Overview
This guide will help you migrate from your old MongoDB database to a new one.

---

## 📋 What You Have

- ✅ **28 Workbook Templates** stored in `scripts/workbooks-template.json`
- ✅ **Admin Authentication System** (email + password based)
- ✅ **New MongoDB Connection String** in `.env.local`

---

## 🔧 Migration Steps

### **Step 1: Update Admin Credentials**

Edit `scripts/createAdmin.js` and change these lines (around line 27-28):

```javascript
const adminEmail = 'admin@fallingupward.com';      // CHANGE THIS TO YOUR EMAIL
const adminPassword = 'Admin@123456';              // CHANGE THIS TO YOUR PASSWORD
```

### **Step 2: Run Migration Commands**

Execute these commands **in order**:

```bash
# 1. Import 28 workbook templates into new database
node scripts/importMasterTemplates.js

# 2. Create admin user with password
node scripts/createAdmin.js

# 3. Create database indexes for performance
npm run create-indexes

# 4. Verify database setup
npm run verify-indexes

# 5. Start your application
npm run dev
```

### **Step 3: Login**

- Go to: http://localhost:3000/login
- Use the email and password you set in Step 1

---

## ✅ Expected Results

After running the migration:

- **28 workbook templates** in your new database
- **1 admin user** with your credentials
- **Database indexes** for optimal performance
- **Application ready** to use

---

## 🔍 Verification

Check that everything worked:

```bash
# Check workbook count (should show 28)
node scripts/checkWorkbookStatus.js

# Verify indexes
npm run verify-indexes
```

---

## 🆘 Troubleshooting

**Error: "Admin already exists"**
- Admin was already created, you can login with those credentials

**Error: "MONGODB_URI not found"**
- Make sure `.env.local` file exists with your new connection string

**Error: "Cannot connect to MongoDB"**
- Verify your MongoDB connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas

---

## 📞 Need Help?

If you encounter any issues, check:
1. `.env.local` has the correct `MONGODB_URI`
2. MongoDB Atlas allows your IP address
3. Credentials in `createAdmin.js` are updated

