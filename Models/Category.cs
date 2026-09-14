namespace InventoryApi.Models;

// a model of category is defined here
public class Category
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedDate { get; set; }

    // One category can have many products
    // This represents the one-to-many relationship in the C# object model:
    // one Category can have many Product objects.
    //
    // ICollection<Product> represents a collection of Product objects.
    // It is the C# representation of the related Products.
    //
    // new List<Product>() initializes an empty collection
    // so Products can be added to it.
    //
    // This navigation property helps us navigate from a Category
    // to its related Products.
    public ICollection<Product> Products { get; set; } = new List<Product>();
}



