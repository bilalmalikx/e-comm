import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';
import { MatIconModule } from '@angular/material/icon';
import { MaterialSuccessService } from '../../../core/services/success.service';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  signupForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  isOpen = true;

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public activeModal: NgbActiveModal,
    private toast: MaterialSuccessService,
    private loader: LoaderService
  ) {
    this.signupForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
        dob: ['', Validators.required],
        address: ['', Validators.required],
        gender: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatch }
    );
  }

  passwordMatch(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null
      : { notMatching: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSignup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.loader.show();
    const formValue = { ...this.signupForm.value };
    if (this.previewUrl) {
      formValue.photoUrl = this.previewUrl.toString();
    }
    if (formValue.dob instanceof Date) {
      const d = formValue.dob as Date;
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      formValue.dob = `${d.getFullYear()}-${month}-${day}`;
    }

    delete formValue.photo;
    const data: RegisterRequest = formValue;

    this.authService.register(data).subscribe({
      next: () => {
        this.loader.hide();
        this.activeModal.close();
        this.toast.success('Account Created!', 'Please check your mail box we sent email verification after that you can now log in 👋', 3000);
      },
      error: (err) => {
        this.loader.hide();
        console.error('Signup Error:', err);
        let errorMsg = 'Something went wrong ❌';
        if (err.error) {
          if (typeof err.error === 'string') errorMsg = err.error;
          else if (err.error.detail) errorMsg = err.error.detail;
          else if (err.error.message) errorMsg = err.error.message;
          else errorMsg = JSON.stringify(err.error);
        }
        this.toast.error('Signup Failed', errorMsg, 4000);
      },
    });
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
