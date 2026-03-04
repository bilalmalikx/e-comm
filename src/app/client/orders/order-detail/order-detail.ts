import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { LoaderService } from '../../../core/services/loader.service';
import { finalize } from 'rxjs';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.scss'],
})
export class OrderDetail {
  order: Order = {} as Order;
  items: CartItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    public loader: LoaderService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.loader.show();
    this.orderService
      .getById(id)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (res) => {
          this.order = res;
          try {
            this.items = JSON.parse(res.items_json);
          } catch {
            this.items = [];
          }
        },
        error: (err) => console.error('Error loading order:', err),
      });
  }
}
