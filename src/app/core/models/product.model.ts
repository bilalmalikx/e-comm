export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  currency: string;   // default "PKR"
  stock: number;
  image_url?: string;
  created_at?: string;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  stock?: number;
  imageUrl?: string;
}
