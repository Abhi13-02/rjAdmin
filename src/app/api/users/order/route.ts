import dbConnect from "@/libs/dbconnect";
import Orders, { OrderItem } from "@/models/Orders";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch orders for the user
    const orders = await Orders.find({ userId }, "items totalAmount status createdAt").lean();

    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      items: order.items.map((item:OrderItem) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        images: item.images
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    }));

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
