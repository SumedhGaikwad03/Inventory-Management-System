using System.ComponentModel.DataAnnotations;

namespace InventoryApi.DTOs.Products;

public class UpdateProductDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int Quantity { get; set; }

    [Range(typeof(decimal), "0", "9999999999999999.99")]
    public decimal Price { get; set; }

    [Required]
    public int CategoryId { get; set; }
}