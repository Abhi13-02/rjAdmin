import dbConnect from "@/libs/dbconnect";
import Products from "@/models/Products";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Configure the S3 client for R2
const s3 = new S3Client({
  region: "auto", // Use 'auto' or your R2 region
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, // Replace with your R2 endpoint
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY as string,
  },
});

// Helper function to extract object key from R2 public URL
function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObject = new URL(url);
    // Decode the path to handle URL-encoded characters like %20 (spaces)
    return decodeURIComponent(urlObject.pathname.substring(1)); // Remove leading slash from path
  } catch (error) {
    console.error("Invalid URL:", url);
    return null;
  }
}

// DELETE a product by ID
export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = await params;

  try {
    await dbConnect();
    const deletedProduct = await Products.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // console.log("Deleted product:", deletedProduct);

    // Delete associated images from R2 bucket
    if (deletedProduct.images && deletedProduct.images.length > 0) {
      const deletePromises = deletedProduct.images.map(async (imageUrl: string) => {
        const key = extractKeyFromUrl(imageUrl);

        if (key) {
          try {
            const deleteParams = {
              Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME, // Ensure this is defined in .env
              Key: key,
            };

            const command = new DeleteObjectCommand(deleteParams);
            const response = await s3.send(command);

            // console.log("Image deleted from R2:", key , response);
            
          } catch (err) {
            console.error(`Failed to delete image: ${key}`, err);
          }
        } else {
          console.warn(`Invalid image URL, skipping: ${imageUrl}`);
        }
      });

      await Promise.all(deletePromises);
    } else {
      console.log("No images to delete for the product.");
    }

    return NextResponse.json({ message: "Product and associated images deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product and associated images" },
      { status: 500 }
    );
  }
}

// GET a product by ID
export async function GET(req: NextRequest, { params }: any) {
  const { id } = await params;
  try {
    await dbConnect();
    const product = await Products.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT update a product by ID
export async function PUT(req: NextRequest, { params }: any) {
  const { id } = await params;

  try {
    const body = await req.json();
    await dbConnect();
    const updatedProduct = await Products.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
