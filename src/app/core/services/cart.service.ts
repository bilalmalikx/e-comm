import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private api: ApiService) {}

  loadCart(): Observable<CartItem[]> {
    return this.api.get<{ items: CartItem[] }>('/cart').pipe(
      map(response => response.items),
      tap(items => this.cartSubject.next(items))
    );
  }

  add(item: CartItem): Observable<CartItem[]> {
    return this.api.post<{ items: CartItem[] }>('/cart/add', item).pipe(
      map(response => response.items),
      tap(items => this.cartSubject.next(items))
    );
  }

  remove(productId: number): Observable<CartItem[]> {
    return this.api.post<{ items: CartItem[] }>('/cart/remove', { productId }).pipe(
      map(response => response.items),
      tap(items => this.cartSubject.next(items))
    );
  }

  getCart(): Observable<CartItem[]> {
    return this.cart$;
  }
}
