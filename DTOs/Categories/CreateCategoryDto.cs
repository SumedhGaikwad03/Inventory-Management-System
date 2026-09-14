using System.ComponentModel.DataAnnotations; // this part allows to do things like [stringlength and all]

namespace InventoryApi.DTOs.Categories;// helps the complier to track this class of the file 

public class CreateCategoryDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }
}