import { apiClient } from '../../../api/client.ts';
import { API_ENDPOINTS } from '../../../api/endpoints.ts';
import type {
  ProductPagedResponseDto,
  ProductQueryDto,
  ProductResponseDto,
  CreateProductDto,
  UpdateProductDto,
} from '../../../types/index.ts';

export const productApi = {
  /**
   * Retrieves a paginated and filtered list of products
   */
  getAll: async (query?: ProductQueryDto): Promise<ProductPagedResponseDto> => {
    const response = await apiClient.get<ProductPagedResponseDto>(
      API_ENDPOINTS.PRODUCTS.BASE,
      { params: query }
    );
    return response.data;
  },

  /**
   * Retrieves a single product by its ID
   */
  getById: async (id: number): Promise<ProductResponseDto> => {
    const response = await apiClient.get<ProductResponseDto>(
      API_ENDPOINTS.PRODUCTS.BY_ID(id)
    );
    return response.data;
  },

  /**
   * Creates a new product in the catalog (Admin only)
   */
  create: async (data: CreateProductDto): Promise<ProductResponseDto> => {
    const response = await apiClient.post<ProductResponseDto>(
      API_ENDPOINTS.PRODUCTS.BASE,
      data
    );
    return response.data;
  },

  /**
   * Updates an existing product (Admin only)
   */
  update: async (
    id: number,
    data: UpdateProductDto
  ): Promise<ProductResponseDto> => {
    const response = await apiClient.put<ProductResponseDto>(
      API_ENDPOINTS.PRODUCTS.BY_ID(id),
      data
    );
    return response.data;
  },

  /**
   * Deletes a product by its ID (Admin only)
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },
};
