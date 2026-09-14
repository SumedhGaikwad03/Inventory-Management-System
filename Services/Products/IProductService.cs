using InventoryApi.DTOs.Products;

namespace InventoryApi.Services.Products;

public interface IProductService
{
   Task<ProductPagedResponseDto> GetAllAsync(ProductQueryDto query);

    Task<ProductResponseDto?> GetByIdAsync(int id);

    Task<ProductResponseDto> CreateAsync(CreateProductDto dto);

    Task<ProductResponseDto?> UpdateAsync(int id, UpdateProductDto dto);

    Task<bool> DeleteAsync(int id);
}
//anything thata calls IproductService can use this 5 methods 
//this is kinda a contract 
