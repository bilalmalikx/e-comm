import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { LoaderService } from '../../core/services/loader.service';
import { finalize } from 'rxjs';
import { HomeProductComponent } from '../products/home-product.component/home-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeProductComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.scss'],
})
export class DashboardHome implements OnInit {
  products: Product[] = [];
  offers: Product[] = [];
  filterText = '';
  currentIndex = 0;

  @ViewChild('productsSection') productsSection!: ElementRef;

  constructor(
    private productService: ProductService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.autoSlideOffers();
  }

  loadProducts(): void {
    this.loader.show();
    this.productService
      .getAll()
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (res: Product[]) => {
          this.products = res;
          this.offers = res.slice(0, 5);
        },
        error: (err) => console.error('Error loading products:', err),
      });
  }

  get filteredProducts(): Product[] {
    if (!this.products) return [];
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  prevSlide(): void {
    this.currentIndex =
      this.currentIndex === 0 ? this.offers.length - 1 : this.currentIndex - 1;
  }

  nextSlide(): void {
    this.currentIndex =
      this.currentIndex === this.offers.length - 1 ? 0 : this.currentIndex + 1;
  }

  autoSlideOffers(): void {
    setInterval(() => this.nextSlide(), 6000);
  }

  scrollToProducts(): void {
    if (this.productsSection) {
      this.productsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
