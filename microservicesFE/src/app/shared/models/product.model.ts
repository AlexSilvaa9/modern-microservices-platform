export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  active?: boolean;
  rating?: number;
  reviews?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
