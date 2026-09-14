/**
 * Matches backend ProductResponseDto
 */
export interface ProductResponseDto {
  id: number;
  name: string;
  quantity: number;
  price: number;
  categoryId: number;
  categoryName: string;
  createdDate: string;
  updatedDate: string;
}

/**
 * Matches backend ProductPagedResponseDto
 */
export interface ProductPagedResponseDto {
  items: ProductResponseDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Matches backend ProductQueryDto
 */
export interface ProductQueryDto {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | string;
  lowStock?: boolean;
}

/**
 * Matches backend CreateProductDto
 */
export interface CreateProductDto {
  name: string;
  quantity: number;
  price: number;
  categoryId: number;
}

/**
 * Matches backend UpdateProductDto
 */
export interface UpdateProductDto {
  name: string;
  quantity: number;
  price: number;
  categoryId: number;
}
