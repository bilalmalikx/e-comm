import { CartItem } from './cart.model';

export type OrderStatus =
  | 'awaiting_payment'
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id?: number;
  user_id: number;
  items_json: string; // stored JSON of CartItem[]
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  status: OrderStatus;
  payment_intent_id: string;
  created_at?: string;
}
