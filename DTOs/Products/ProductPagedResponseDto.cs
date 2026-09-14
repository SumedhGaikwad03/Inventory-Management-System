namespace InventoryApi.DTOs.Products;

public class ProductPagedResponseDto
{
    public List<ProductResponseDto> Items { get; set; } = new();

    public int Page { get; set; }

    public int PageSize { get; set; }

    public int TotalItems { get; set; }

    public int TotalPages { get; set; }
}