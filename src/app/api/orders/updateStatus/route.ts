/// This route is probably for the admin dashboard


import Orders from '@/models/Orders';
import { NextRequest, NextResponse } from 'next/server';


export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const { orderId, newStatus } = await req.json();

    // Validate newStatus
    const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Find the order by ID
    const order = await Orders.findById(orderId);

    if (!order) {
      console.error('Order not found');
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update the delivery status
    order.status = newStatus;
    await order.save();

    return NextResponse.json(
      { message: 'Order status updated successfully', order },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
