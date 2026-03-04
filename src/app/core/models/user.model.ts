export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  dob: string;
  address: string;
  gender: string;
  photo_url: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface UpdateMeRequest {
  name?: string;
  phone?: string;
  dob?: string;
  address?: string;
  gender?: string;
  photoUrl?: string;
}
