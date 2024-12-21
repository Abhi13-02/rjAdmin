import dbConnect from "@/libs/dbconnect";
import Products from "@/models/Products";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const {
      title,
      description,
      price,
      category,
      discountedPrice,
      tags,
      sizes, // Sizes now include stock information
      images,
    } = body;


    const newProduct = await Products.create({
      title,
      description,
      price,
      category,
      tags,
      discountedPrice,
      sizes, // Store sizes with their stock in the database
      images,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully",
        data: newProduct,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add product" },
      { status: 500 }
    );
  }
}
