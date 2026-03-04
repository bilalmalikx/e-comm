import { Component, input } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-product',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    NgClass,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './home-product.component.html',
  styleUrl: './home-product.component.scss',
})
export class HomeProductComponent {
  product = input.required<Product>();
}
