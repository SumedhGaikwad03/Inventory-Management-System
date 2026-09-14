using InventoryApi.DTOs.Categories;

namespace InventoryApi.Services.Categories;

public interface ICategoryService
{
    Task<List<CategoryResponseDto>> GetAllAsync();

    Task<CategoryResponseDto?> GetByIdAsync(int id);

    Task<CategoryResponseDto> CreateAsync(CreateCategoryDto dto);

    Task<CategoryResponseDto?> UpdateAsync(
        int id,
        UpdateCategoryDto dto);

        // this menthod may rwtun null as sometimes we may try to update 
        // a non existing category 
        

    Task<bool> DeleteAsync(int id);
}
// this tells that the category service can do this five operations
// controller can depend on IcategoryService to perform these 
// operations without knowing the implementation details