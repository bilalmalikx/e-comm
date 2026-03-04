import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.model';
import { MaterialSuccessService } from '../../../core/services/success.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
})
export class ProductDetail implements OnInit {
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toast: MaterialSuccessService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getById(id).subscribe({
        next: (res) => (this.product = res),
        error: (err) => console.error('Error loading product:', err),
      });
    }
  }

  addToCart(product: Product) {
    if (!product.id) {
      console.error('Product has no ID, cannot add to cart');
      return;
    }

    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      imageUrl: product.image_url,
    };

    this.cartService.add(item).subscribe({
      next: (cartItems) => {
        this.toast.success('Addedd', `${product.name} added to cart! ✅`);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.toast.error('Failed', 'Failed to add to cart ❌');
      },
    });
  }
}
