import { apiClient } from '../../../api/client.ts';
import { API_ENDPOINTS } from '../../../api/endpoints.ts';
import type {
  ProductPagedResponseDto,
  ProductResponseDto,
  CategoryResponseDto,
  InventoryTransactionResponseDto,
} from '../../../types/index.ts';

export interface DashboardMetrics {
  totalProducts: number;
  totalCategories: number;
  lowStockCount: number;
  lowStockItems: ProductResponseDto[];
  recentTransactions: InventoryTransactionResponseDto[];
}

export const dashboardApi = {
  /**
   * Fetches composite overview metrics for the dashboard.
   * Concurrently requests product pagination stats, low-stock items, and category totals.
   * Only fetches inventory transactions if the user has Admin privileges.
   */
  getDashboardData: async (isAdmin: boolean): Promise<DashboardMetrics> => {
    // 1. Fetch total products count via lightweight paged query (page 1, pageSize 1)
    const productsPromise = apiClient.get<ProductPagedResponseDto>(
      API_ENDPOINTS.PRODUCTS.BASE,
      { params: { page: 1, pageSize: 1 } }
    );

    // 2. Fetch low-stock count and top 5 low-stock items
    const lowStockPromise = apiClient.get<ProductPagedResponseDto>(
      API_ENDPOINTS.PRODUCTS.BASE,
      { params: { lowStock: true, page: 1, pageSize: 5 } }
    );

    // 3. Fetch all categories to calculate total categories count
    const categoriesPromise = apiClient.get<CategoryResponseDto[]>(
      API_ENDPOINTS.CATEGORIES.BASE
    );

    // 4. Fetch recent transactions conditionally for Admins
    const transactionsPromise = isAdmin
      ? apiClient.get<InventoryTransactionResponseDto[]>(
          API_ENDPOINTS.TRANSACTIONS.BASE
        )
      : Promise.resolve({ data: [] as InventoryTransactionResponseDto[] });

    // Execute concurrently
    const [productsRes, lowStockRes, categoriesRes, transactionsRes] =
      await Promise.all([
        productsPromise,
        lowStockPromise,
        categoriesPromise,
        transactionsPromise,
      ]);

    return {
      totalProducts: productsRes.data.totalItems,
      totalCategories: categoriesRes.data.length,
      lowStockCount: lowStockRes.data.totalItems,
      lowStockItems: lowStockRes.data.items,
      recentTransactions: transactionsRes.data.slice(0, 5),
    };
  },
};
