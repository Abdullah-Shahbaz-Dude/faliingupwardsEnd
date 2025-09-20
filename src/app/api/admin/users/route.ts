// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import { verifyAdminAccess } from "@/lib/nextauth-helpers";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    await connectMongo();

    // Extract pagination and filtering parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    // Build query filters
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (status === 'completed') {
      query.isCompleted = true;
    } else if (status === 'active') {
      query.isCompleted = { $ne: true };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute queries in parallel for better performance
    const [users, totalCount] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      success: true,
      data: { 
        users,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
          hasNext,
          hasPrev
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    const { name, email, role } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    if (role && !["user", "admin"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Use atomic operation to prevent race condition
    let newUser;
    try {
      newUser = new User({
        name,
        email,
        role: role || "user",
        // No password field - users access via shareable link only
      });

      await newUser.save();
    } catch (error: any) {

      if (error.code === 11000) {
        return NextResponse.json(
          { success: false, message: "User with this email already exists" },
          { status: 409 }
        );
      }
      throw error; // Re-throw other errors
    }

    const { ...userResponse } = newUser.toObject();

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
