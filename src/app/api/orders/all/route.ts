import dbConnect from "@/libs/dbconnect";
import Orders from "@/models/Orders";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){

  try {
    await dbConnect();
    const orders = await Orders.find();
    return NextResponse.json(orders,{status:200});  
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}