import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss'
})
export class VerifyEmail {
  message = 'Verifying your email...';
  verified = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');

      if (token) {
        // Send token to backend verify API
        this.http.post('http://localhost:8000/auth/verify-email', { token }).subscribe({
          next: () => {
            this.message = '✅ Email verified successfully!';
            this.verified = true;
          },
          error: (err) => {
            console.error(err);
            this.message = '❌ Verification failed or token expired.';
          },
        });
      } else {
        this.message = 'Invalid verification link.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}
