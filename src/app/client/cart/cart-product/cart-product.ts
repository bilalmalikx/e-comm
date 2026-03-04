// pages/cart/cart-product/cart-product.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartItem } from '../../../core/models/cart.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-product',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cart-product.html',
  styleUrls: ['./cart-product.scss'],
})
export class CartProduct {
  @Input({ required: true }) cartProduct!: CartItem;
  @Output() updateCartEvent = new EventEmitter<void>();

  constructor(private cartService: CartService) {}

  updateQuantity(change: number) {
    const newQty = this.cartProduct.qty + change;
    if (newQty < 1) return;

    const updated: CartItem = { ...this.cartProduct, qty: newQty };
    this.cartService.add(updated).subscribe({
      next: () => this.updateCartEvent.emit(),
      error: (err) => console.error(err),
    });
  }

  removeProduct() {
    this.cartService.remove(this.cartProduct.productId).subscribe({
      next: () => this.updateCartEvent.emit(),
      error: (err) => console.error(err),
    });
  }
}
