namespace InventoryApi.Models;

public class InventoryTransaction
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int UserId { get; set; }

    public int QuantityChanged { get; set; }

    public string TransactionType { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    // Navigation properties

    public Product Product { get; set; } = null!;

    public User User { get; set; } = null!;
}