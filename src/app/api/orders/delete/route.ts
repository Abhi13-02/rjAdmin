import dbConnect from "@/libs/dbconnect";
import Order from "@/models/Orders";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return new Response(
      JSON.stringify({ error: "Order ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  await dbConnect();

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ message: "Order deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to delete order" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
