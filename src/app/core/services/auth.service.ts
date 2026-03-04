import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  AuthTokens,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetWithTokenRequest,
  VerifyOtpRequest,
} from '../models/auth.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessTokenKey = 'access_token';
  private readonly refreshTokenKey = 'refresh_token';
  private readonly userKey = 'user';

  constructor(private api: ApiService, private router: Router) {}

  register(payload: RegisterRequest): Observable<any> {
    return this.api.post('/auth/register', payload);
  }

  verifyEmail(token: string): Observable<any> {
    return this.api.get(`/auth/verify-email/${encodeURIComponent(token)}`);
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', payload).pipe(
      tap((res) => {
        this.storeTokens(res);
        this.storeUser(res.user);
      })
    );
  }

  refresh(refreshToken?: string): Observable<AuthTokens | null> {
    const token = refreshToken || localStorage.getItem(this.refreshTokenKey);
    if (!token) return of(null);

    return this.api
      .post<AuthTokens>('/auth/refresh', { refresh_token: token })
      .pipe(
        map((res) => {
          this.storeTokens(res);
          return res;
        }),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
  }

  changePassword(payload: ChangePasswordRequest) {
    return this.api.post('/auth/change-password', payload);
  }

  forgotPassword(payload: ForgotPasswordRequest) {
    return this.api.post('/auth/forgot-password', payload);
  }

  resetPasswordWithToken(payload: ResetWithTokenRequest) {
    return this.api.post('/auth/reset-password', {
      reset_token: payload.reset_token,
      newPassword: payload.newPassword,
      confirmPassword: payload.confirmPassword,
    });
  }

  verifyOtp(payload: VerifyOtpRequest) {
    return this.api.post('/auth/forgot-password/verify', payload);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  private storeTokens(tokens: AuthTokens) {
    localStorage.setItem(this.accessTokenKey, tokens.access_token);
    localStorage.setItem(this.refreshTokenKey, tokens.refresh_token);
  }

  private storeUser(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }
}
