import { Component } from '@angular/core';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { LoaderService } from '../../../core/services/loader.service';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './order-list.html',
  styleUrls: ['./order-list.scss'],
})
export class OrderList {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    public loader: LoaderService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loader.show();
    this.orderService
      .getAll()
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (res) => (this.orders = res),
        error: (err) => console.error('Error loading orders:', err),
      });
  }
}
