export interface CreatePaymentIntent {
  orderId: number;
  paymentMethodType?: string;
  savePaymentMethod?: boolean;
  idempotencyKey?: string;
}

export interface RefundRequest {
  paymentId: number;
}
