import { apiClient } from '../../../api/client.ts';
import { API_ENDPOINTS } from '../../../api/endpoints.ts';
import type {
  InventoryTransactionResponseDto,
  CreateTransactionParams,
} from '../../../types/index.ts';

export const transactionApi = {
  /**
   * Retrieves all inventory transactions (Admin only)
   */
  getAll: async (): Promise<InventoryTransactionResponseDto[]> => {
    const response = await apiClient.get<InventoryTransactionResponseDto[]>(
      API_ENDPOINTS.TRANSACTIONS.BASE
    );
    return response.data;
  },

  /**
   * Retrieves a single inventory transaction by ID (Admin only)
   */
  getById: async (id: number): Promise<InventoryTransactionResponseDto> => {
    const response = await apiClient.get<InventoryTransactionResponseDto>(
      API_ENDPOINTS.TRANSACTIONS.BY_ID(id)
    );
    return response.data;
  },

  /**
   * Retrieves inventory transactions for a specific product (Admin only)
   */
  getByProductId: async (
    productId: number
  ): Promise<InventoryTransactionResponseDto[]> => {
    const response = await apiClient.get<InventoryTransactionResponseDto[]>(
      API_ENDPOINTS.TRANSACTIONS.BY_PRODUCT_ID(productId)
    );
    return response.data;
  },

  /**
   * Creates a new inventory stock adjustment transaction (Admin only)
   */
  create: async (
    params: CreateTransactionParams
  ): Promise<InventoryTransactionResponseDto> => {
    const response = await apiClient.post<InventoryTransactionResponseDto>(
      API_ENDPOINTS.TRANSACTIONS.BASE,
      params
    );
    return response.data;
  },
};
