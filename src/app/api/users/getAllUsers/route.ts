
import User from "@/models/User";
import { NextResponse } from "next/server";
import dbConnect from "@/libs/dbconnect";
import Orders from "@/models/Orders";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Get all users
    const users = await User.find();

    // Map users with their order count
    const userSummaries = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Orders.countDocuments({ userId: user._id });
        return {
          userId: user._id,
          email: user.email,
          name: user.name,
          address: user.addresses[0], // Assuming the first address
          orderCount,
        };
      })
    );

    return NextResponse.json(userSummaries, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
