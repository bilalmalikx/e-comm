import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Product, ProductUpdateRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Product[]> {
    return this.api.get('/products/all');
  }

  getById(id: number): Observable<Product> {
    return this.api.get(`/products/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.api.post('/products', product);
  }

  update(id: number, product: ProductUpdateRequest): Observable<Product> {
    return this.api.put(`/products/${id}`, product);
  }

  delete(id: number): Observable<any> {
    return this.api.delete(`/products/${id}`);
  }
}
