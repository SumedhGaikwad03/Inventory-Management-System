namespace InventoryApi.DTOs.Products;

public class ProductResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    public DateTime UpdatedDate { get; set; }
}