/**
 * Matches backend InventoryTransactionResponseDto
 */
export interface InventoryTransactionResponseDto {
  id: number;
  productId: number;
  productName: string;
  userId: number;
  username: string;
  quantityChanged: number;
  transactionType: string;
  createdDate: string;
}

/**
 * Payload parameters for creating an inventory transaction
 */
export interface CreateTransactionParams {
  productId: number;
  quantityChanged: number;
  transactionType: string;
}
