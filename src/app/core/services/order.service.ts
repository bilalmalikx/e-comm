import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private api: ApiService) {}

  create(order: Order): Observable<Order> {
    return this.api.post('/orders', order);
  }

  getAll(): Observable<Order[]> {
    return this.api.get('/orders');
  }

  getById(id: number): Observable<Order> {
    return this.api.get(`/orders/${id}`);
  }

  delete(id: number): Observable<void> {
  return this.api.delete(`/orders/${id}`);
}


  updateStatus(id: number, status: string): Observable<Order> {
    return this.api.put(`/orders/${id}/status`, { status });
  }
}
