namespace InventoryApi.Models;

public class Product
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    // Foreign key that we browerd from the category table 
    public int CategoryId { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime UpdatedDate { get; set; }

    // Navigation property , as it allows ef core to navigate from
    // catagory to products 
    //its kind of an relantional objects 
    public Category? Category { get; set; } // its an navigation property that helps to map products to catgories 

     public ICollection<InventoryTransaction> InventoryTransactions { get; set; }
        = new List<InventoryTransaction>();

        // ICollection<InventoryTransaction> represents a collection of related InventoryTransaction objects in C# memory.
}