using System.ComponentModel.DataAnnotations;

namespace InventoryApi.DTOs.InventoryTransactions;

public class CreateInventoryTransactionDto
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    public int QuantityChanged { get; set; }

    [Required]
    [StringLength(20)]
    public string TransactionType { get; set; } = string.Empty;
}
