export interface SignInRequest {
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  gender: string;
  photo?: File | null;
  password: string;
  confirmPassword: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  data?: any;
}
