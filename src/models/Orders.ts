import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  images: string[]; // Support multiple images
}

export interface IOrder extends Document {
  userId: IUser['_id'];
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: IUser['addresses'][0];
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'COD' | 'Prepaid';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
  images: { type: [String], required: true }, 
});

const OrderSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: Object, required: true },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['COD', 'Prepaid'], required: true },
  },
  { timestamps: true }
);

export default mongoose.models?.Order || mongoose.model<IOrder>('Order', OrderSchema);
