import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { LoginRequest, AuthResponse } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { MaterialSuccessService } from '../../../core/services/success.service';
import { Forget } from '../forget/forget';
import { SignIn } from '../sign-in/sign-in';
import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private toast: MaterialSuccessService,
    private storage: StorageService,
    public loader: LoaderService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    const token = this.storage.getAccessToken();
    if (token) {
      this.clearAndReload();
      return;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loader.show();
    const data: LoginRequest = this.loginForm.value;

    this.authService.login(data).subscribe({
      next: (res: AuthResponse) => {
        this.loader.hide();

        if (res.access_token) this.storage.setAccessToken(res.access_token);
        if (res.refresh_token) this.storage.setRefreshToken(res.refresh_token);
        if (res.user) this.storage.setUser(res.user);

        this.toast.success('Logged In!', 'Welcome back 👋');

        if (res.user.role === 'admin') {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/app');
        }
      },
      error: (err) => {
        this.loader.hide();
        this.toast.error(
          'Login Failed',
          err.error?.message || 'Invalid credentials ❌'
        );
      },
    });
  }

  openForgotPassword() {
    this.modalService.open(Forget, { centered: true, size: 'lg' });
  }

  openSignup() {
    this.modalService.open(SignIn, { centered: true, size: 'lg' });
  }

  private clearAndReload() {
    this.storage.clearAll();
    sessionStorage.clear();

    if ('caches' in window) {
      caches
        .keys()
        .then((names) => names.forEach((name) => caches.delete(name)));
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
    }

    window.location.replace('/');
  }
}
