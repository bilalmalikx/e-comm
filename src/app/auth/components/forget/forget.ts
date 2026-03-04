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
import { MaterialSuccessService } from '../../../core/services/success.service';
import {
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetWithTokenRequest,
} from '../../../core/models/auth.model';
import { MatIconModule } from '@angular/material/icon';
import { LoaderService } from '../../../core/services/loader.service';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-forget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './forget.html',
  styleUrls: ['./forget.scss'],
})
export class Forget {
  step = 1;
  isOpen = true;

  forgotForm: FormGroup;
  otpForm: FormGroup;
  resetForm: FormGroup;
  showNewPassword = false;
  showConfirmPassword = false;

  otpInvalid = false;
  otpArray = [0, 1, 2, 3];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: MaterialSuccessService,
    private activeModal: NgbActiveModal,
    private loader: LoaderService,
    private storage: StorageService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      otp0: ['', [Validators.required]],
      otp1: ['', [Validators.required]],
      otp2: ['', [Validators.required]],
      otp3: ['', [Validators.required]],
    });

    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { notMatching: true };
  }
  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  sendResetLink() {
    if (this.forgotForm.valid) {
      this.loader.show();
      const data: ForgotPasswordRequest = this.forgotForm.value;

      this.authService.forgotPassword(data).subscribe({
        next: () => {
          this.loader.hide();
          this.toast.success('OTP Sent', 'Check your email ✅');
          this.step = 2;
          this.otpInvalid = false;

          this.storage.setResetEmail(this.forgotForm.value.email);
        },
        error: () => {
          this.loader.hide();
          this.toast.error('Failed', 'Email not found ❌');
        },
      });
    }
  }

  verifyCode() {
    const enteredOtp = `${this.otpForm.value.otp0}${this.otpForm.value.otp1}${this.otpForm.value.otp2}${this.otpForm.value.otp3}`;
    const email = this.storage.getResetEmail() || '';

    const data: VerifyOtpRequest = {
      email: email,
      otp: enteredOtp,
    };

    this.loader.show();
    this.authService.verifyOtp(data).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.toast.success('OTP Verified', 'You can reset your password ✅');
        this.step = 3;
        this.otpInvalid = false;

        if (res?.reset_token) {
          this.storage.setResetToken(res.reset_token);
        }
      },
      error: () => {
        this.loader.hide();
        this.otpInvalid = true;
      },
    });
  }

  resendOtp() {
    const email = this.storage.getResetEmail() || '';
    if (email) {
      this.loader.show();
      const data: ForgotPasswordRequest = { email: email };
      this.authService.forgotPassword(data).subscribe({
        next: () => {
          this.loader.hide();
          this.toast.success('OTP Resent', 'Check your email ✅');
        },
        error: () => {
          this.loader.hide();
          this.toast.error('Failed', 'Email not found ❌');
        },
      });
    }
  }

  moveToNext(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && index < this.otpArray.length - 1) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      nextInput?.focus();
    } else if (event.key === 'Backspace' && index > 0) {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      prevInput?.focus();
    }
  }

  updatePassword() {
    if (this.resetForm.valid) {
      const token = this.storage.getResetToken() || '';

      const data: ResetWithTokenRequest = {
        reset_token: token,
        newPassword: this.resetForm.value.newPassword,
        confirmPassword: this.resetForm.value.confirmPassword,
      };

      this.loader.show();
      this.authService.resetPasswordWithToken(data).subscribe({
        next: () => {
          this.loader.hide();
          this.toast.success('Password Updated', 'Login with new password ✅');

          this.storage.removeResetEmail();
          this.storage.removeResetToken();
          this.closeModal();
        },
        error: () => {
          this.loader.hide();
          this.toast.error('Failed', 'Something went wrong ❌');
        },
      });
    }
  }

  closeModal() {
    this.isOpen = false;
    this.activeModal.dismiss();
  }
}
