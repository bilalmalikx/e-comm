// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-verify-email',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div class="verify-container">
//       <h2>{{ message }}</h2>
//       <button *ngIf="verified" (click)="goToLogin()">Go to Login</button>
//     </div>
//   `,
//   styles: [`

//   `]
// })
// export class VerifyEmail implements OnInit {
//   message = 'Verifying your email...';
//   verified = false;

//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.route.queryParamMap.subscribe((params) => {
//       const token = params.get('token');

//       if (token) {
//         // Send token to backend verify API
//         this.http.post('http://localhost:8000/auth/verify-email', { token }).subscribe({
//           next: () => {
//             this.message = '✅ Email verified successfully!';
//             this.verified = true;
//           },
//           error: (err) => {
//             console.error(err);
//             this.message = '❌ Verification failed or token expired.';
//           },
//         });
//       } else {
//         this.message = 'Invalid verification link.';
//       }
//     });
//   }

//   goToLogin() {
//     this.router.navigate(['/']);
//   }
// }
