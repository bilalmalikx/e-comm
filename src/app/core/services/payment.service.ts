import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { CreatePaymentIntent, RefundRequest } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private api: ApiService) {}

  checkout(payload: CreatePaymentIntent): Observable<any> {
    return this.api.post('/payments/checkout', payload);
  }

  refund(payload: RefundRequest): Observable<any> {
    return this.api.post('/payments/refund', payload);
  }
}
