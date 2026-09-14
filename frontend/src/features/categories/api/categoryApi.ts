import { apiClient } from '../../../api/client.ts';
import { API_ENDPOINTS } from '../../../api/endpoints.ts';
import type {
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../../types/index.ts';

// basically this file does taking to the backend for queries 

export const categoryApi = { // object containg all catagory related api's
  /**
   * Retrieves all categories from the server
   */
  getAll: async (): Promise<CategoryResponseDto[]> => {
    const response = await apiClient.get<CategoryResponseDto[]>(
      API_ENDPOINTS.CATEGORIES.BASE
    );
    return response.data;
  },

  /**
   * Retrieves a single category by its ID
   */
  getById: async (id: number): Promise<CategoryResponseDto> => {
    const response = await apiClient.get<CategoryResponseDto>(
      API_ENDPOINTS.CATEGORIES.BY_ID(id)
    );
    return response.data;
  },

  /**
   * Creates a new product category (Admin only)
   */
  create: async (data: CreateCategoryDto): Promise<CategoryResponseDto> => {
    const response = await apiClient.post<CategoryResponseDto>(
      API_ENDPOINTS.CATEGORIES.BASE,
      data
    );
    return response.data;
  },

  /**
   * Updates an existing product category (Admin only)
   */
  update: async (
    id: number,
    data: UpdateCategoryDto
  ): Promise<CategoryResponseDto> => {
    const response = await apiClient.put<CategoryResponseDto>(
      API_ENDPOINTS.CATEGORIES.BY_ID(id),
      data
    );
    return response.data;
  },

  /**
   * Deletes a category by its ID (Admin only)
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};
