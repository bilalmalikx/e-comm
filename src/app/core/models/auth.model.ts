import { User } from './user.model';

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  gender: string;
  password: string;
  confirmPassword: string;
  photoUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;    
}

export interface ResetWithTokenRequest {
  reset_token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface MessageResponse {
  message: string;
}
