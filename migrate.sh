#!/bin/bash

# 🚀 Database Migration Script
# This script sets up your new MongoDB database with all required data

echo "================================================"
echo "🚀 Starting Database Migration"
echo "================================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ ERROR: .env.local file not found!"
    echo "Please create .env.local with your MONGODB_URI"
    exit 1
fi

echo "✅ Found .env.local file"
echo ""

# Step 1: Import Workbook Templates
echo "📚 Step 1/4: Importing 28 workbook templates..."
echo "------------------------------------------------"
node scripts/importMasterTemplates.js
if [ $? -ne 0 ]; then
    echo "❌ Failed to import workbook templates"
    exit 1
fi
echo ""

# Step 2: Create Admin User
echo "👤 Step 2/4: Creating admin user..."
echo "------------------------------------------------"
echo "⚠️  Make sure you edited scripts/createAdmin.js with your credentials!"
read -p "Press Enter to continue (or Ctrl+C to cancel)..."
node scripts/createAdmin.js
if [ $? -ne 0 ]; then
    echo "❌ Failed to create admin user"
    exit 1
fi
echo ""

# Step 3: Create Database Indexes
echo "🔧 Step 3/4: Creating database indexes..."
echo "------------------------------------------------"
npm run create-indexes
if [ $? -ne 0 ]; then
    echo "❌ Failed to create indexes"
    exit 1
fi
echo ""

# Step 4: Verify Setup
echo "✅ Step 4/4: Verifying database setup..."
echo "------------------------------------------------"
npm run verify-indexes
echo ""

echo "================================================"
echo "🎉 Migration Complete!"
echo "================================================"
echo ""
echo "✅ Database is ready with:"
echo "   - 28 workbook templates"
echo "   - Admin user account"
echo "   - Optimized indexes"
echo ""
echo "🔗 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Open: http://localhost:3000/login"
echo "   3. Login with your admin credentials"
echo ""
echo "================================================"






