namespace InventoryApi.Models;

public class User
{
    public int Id { get; set; }

    public required string Username { get; set; }

    // Stores the hashed password, never the plain-text password
    public required string PasswordHash { get; set; }

    public required string Email { get; set; }

    public string Role { get; set; } = "User";

    public DateTime CreatedDate { get; set; }

    // C# represents the application model using objects, properties, collections, and navigation properties.
    // EF Core understands/maps those relationships to the database. SQL Server
    //  ultimately stores the simple relational representation: rows, columns, primary keys, and foreign keys
    public ICollection<InventoryTransaction> InventoryTransactions { get; set; }
    = new List<InventoryTransaction>();
}