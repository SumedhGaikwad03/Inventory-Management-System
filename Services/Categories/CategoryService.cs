using System.Security.Cryptography;
using InventoryApi.Data;
using InventoryApi.DTOs.Categories;
using InventoryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Services.Categories;

public class CategoryService : ICategoryService
{
    private readonly InventoryDbContext _context;

    public CategoryService(InventoryDbContext context)
    {
        _context = context;
    }

    // GET: /api/categories
    public async Task<List<CategoryResponseDto>> GetAllAsync()
    {
        return await _context.Categories
            .Select(c => new CategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                CreatedDate = c.CreatedDate
            })
            .ToListAsync();
    }

    // GET: /api/categories/{id}
    public async Task<CategoryResponseDto?> GetByIdAsync(int id)
    {
        return await _context.Categories
            .Where(c => c.Id == id)
            .Select(c => new CategoryResponseDto // this is beacuse it expects thr response to be in the form of 
            // <CatrgoryResponse> 
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                CreatedDate = c.CreatedDate
            })
            .FirstOrDefaultAsync();
    }

    // POST: /api/categories
    public async Task<CategoryResponseDto> CreateAsync(
        CreateCategoryDto dto)
    {
        // Prevent duplicate category names.
        var exists = await _context.Categories
            .AnyAsync(c => c.Name == dto.Name);
            // tchecks if catgory already exists 

        if (exists)
        {
            throw new ArgumentException(
                "A category with this name already exists.");
        }

        var category = new Category
        {
            Name = dto.Name,
            Description = dto.Description,
            CreatedDate = DateTime.UtcNow
        }; // a catagory is created 

        _context.Categories.Add(category); // that is added to temp cache in c# , ef core change traker 

        await _context.SaveChangesAsync(); // then we save the response to SQL

        return new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedDate = category.CreatedDate
        };
    }

    // PUT: /api/categories/{id}
    public async Task<CategoryResponseDto?> UpdateAsync(
        int id,
        UpdateCategoryDto dto)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category is null)
        {
            return null;
        }

        // Prevent two categories from having the same name.
        var duplicate = await _context.Categories
            .AnyAsync(c =>
                c.Id != id &&
                c.Name == dto.Name);

        if (duplicate)
        {
            throw new ArgumentException(
                "A category with this name already exists.");
        }

        category.Name = dto.Name;
        category.Description = dto.Description;

        // populating values to catgeory that we defined above as var 

        await _context.SaveChangesAsync();

        return new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedDate = category.CreatedDate
        };
    }

    // DELETE: /api/categories/{id}
    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category is null)
        {
            return false;
        }

        // Don't allow deletion if products still belong to it.
        var hasProducts = await _context.Products
            .AnyAsync(p => p.CategoryId == id);

        if (hasProducts)
        {
            throw new ArgumentException(
                "Cannot delete a category that has products.");
        }

        _context.Categories.Remove(category); // makes the tracking entity deleted 

        await _context.SaveChangesAsync(); // then that context is saved 

        return true;
    }
}