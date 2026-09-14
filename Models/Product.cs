namespace InventoryApi.Models;

public class Product
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    // Foreign key that we borrowed from the category table
    public int CategoryId { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime UpdatedDate { get; set; }

    // Navigation property , as it allows ef core to navigate from
    // category to products
    //its kind of a relational object
    public Category? Category { get; set; } // it's a navigation property that helps to map products to categories

    // ICollection<InventoryTransaction> represents a collection of related InventoryTransaction objects in C# memory.
    public ICollection<InventoryTransaction> InventoryTransactions { get; set; }
        = new List<InventoryTransaction>();
}
