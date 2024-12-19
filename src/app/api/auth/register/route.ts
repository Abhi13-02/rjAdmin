
import dbConnect from "@/libs/dbconnect";
import User from "@/models/Admin";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, adminSecret } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isAdmin = adminSecret === process.env.ADMIN_SECRET;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });

    return NextResponse.json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
