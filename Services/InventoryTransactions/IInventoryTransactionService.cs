using InventoryApi.DTOs.InventoryTransactions;

namespace InventoryApi.Services.InventoryTransactions;

public interface IInventoryTransactionService
{
    Task<InventoryTransactionResponseDto> CreateAsync(
        int productId,
        int userId,
        int quantityChanged,
        string transactionType);

    Task<List<InventoryTransactionResponseDto>> GetAllAsync();

    Task<InventoryTransactionResponseDto?> GetByIdAsync(int id);
    Task<List<InventoryTransactionResponseDto>> GetByProductIdAsync(
        int productId);
}