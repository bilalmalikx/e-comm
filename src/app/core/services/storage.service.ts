import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private ACCESS_TOKEN = 'access_token';
  private REFRESH_TOKEN = 'refresh_token';
  private USER = 'user';
  private RESET_EMAIL = 'resetEmail';
  private RESET_TOKEN = 'resetToken';

  setAccessToken(token: string) {
    localStorage.setItem(this.ACCESS_TOKEN, token);
  }
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }
  removeAccessToken() {
    localStorage.removeItem(this.ACCESS_TOKEN);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(this.REFRESH_TOKEN, token);
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }
  removeRefreshToken() {
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  setUser(user: any) {
    localStorage.setItem(this.USER, JSON.stringify(user));
  }
  getUser(): any {
    const user = localStorage.getItem(this.USER);
    return user ? JSON.parse(user) : null;
  }
  removeUser() {
    localStorage.removeItem(this.USER);
  }

  setResetEmail(email: string) {
    localStorage.setItem(this.RESET_EMAIL, email);
  }
  getResetEmail(): string | null {
    return localStorage.getItem(this.RESET_EMAIL);
  }
  removeResetEmail() {
    localStorage.removeItem(this.RESET_EMAIL);
  }

  setResetToken(token: string) {
    localStorage.setItem(this.RESET_TOKEN, token);
  }
  getResetToken(): string | null {
    return localStorage.getItem(this.RESET_TOKEN);
  }
  removeResetToken() {
    localStorage.removeItem(this.RESET_TOKEN);
  }
  clearAll() {
    localStorage.clear();
    sessionStorage.clear();
  }
}
