namespace InventoryApi.DTOs.InventoryTransactions;

public class InventoryTransactionResponseDto
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public int UserId { get; set; }

    public string Username { get; set; } = string.Empty;

    public int QuantityChanged { get; set; }

    public string TransactionType { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }
}