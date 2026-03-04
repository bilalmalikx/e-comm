import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User, UpdateMeRequest } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}

  getMe(): Observable<User> {
    return this.api.get('/users/me');
  }

  updateMe(payload: UpdateMeRequest): Observable<User> {
    return this.api.put('/users/me', payload);
  }
  getAllUsers(): Observable<User[]> {
    return this.api.get('/users');
  }

  getUserById(id: number): Observable<User> {
    return this.api.get(`/users/${id}`);
  }

  deleteUser(id: number): Observable<any> {
    return this.api.delete(`/users/${id}`);
  }
}
