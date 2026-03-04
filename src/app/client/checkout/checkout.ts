import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../core/models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { PaymentService } from '../../core/services/payment.service';
import { LoaderService } from '../../core/services/loader.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss'],
})
export class Checkout implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    public loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loader.show();
    const subscription = this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.loader.hide();
        subscription.unsubscribe();
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.loader.hide();
      },
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }

  pay(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const payload = { orderId: 1, items: this.cartItems };
    this.loader.show();
    this.paymentService
      .checkout(payload)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: () => {
          alert('Payment Successful!');
          // Optionally clear the cart after payment
          // this.cartService.clearCart();
        },
        error: (err) => {
          console.error('Payment failed:', err);
          alert('Payment failed. Please try again.');
        },
      });
  }
}
