// pages/cart/cart.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart.model';
import { CartProduct } from './cart-product/cart-product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, CartProduct, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class Cart implements OnInit {
  cartProducts: CartItem[] = [];
  total: number = 0;
  loading = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.loadCart().subscribe({
      next: (items) => {
        this.cartProducts = items;
        this.calculateTotal();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        this.loading = false;
      },
    });
  }

  calculateTotal(): void {
    this.total = this.cartProducts.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
  }

  onCartUpdated() {
    this.loadCart();
  }
}
