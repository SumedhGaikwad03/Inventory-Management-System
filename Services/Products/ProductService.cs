using InventoryApi.Data;
using InventoryApi.DTOs.Products;
using InventoryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Services.Products;

public class ProductService : IProductService
{
    // the service needs to access db from ef core
    private readonly InventoryDbContext _context;

    // as when creating product service give me inventory Dbcontext
    // this helps to track the entity in the c# db
    public ProductService(InventoryDbContext context)
    {
        _context = context; // DI injection of dbcontext into service class
    }


public async Task<ProductPagedResponseDto> GetAllAsync(
    ProductQueryDto query)
{
    // Validate pagination values.
    // checks if the query is valid by the sender
    if (query.Page < 1)
    {
        throw new ArgumentException(
            "Page must be greater than 0.");
    }

    if (query.PageSize < 1 || query.PageSize > 100)
    {
        throw new ArgumentException(
            "Page size must be between 1 and 100.");
    }

    // Start with the database query.
    // Nothing has been executed yet.
    IQueryable<Product> productsQuery = _context.Products
        .Include(p => p.Category);

    // 1. Search
    // this is searching by keyword
    if (!string.IsNullOrWhiteSpace(query.Search))
    {
        var searchKeyword = query.Search.Trim().ToLower();
        productsQuery = productsQuery.Where(p =>
        p.Name.ToLower().Contains(searchKeyword));
    }

    // 2. Low-stock filter
    // this is embedded query as within the url
    if (query.LowStock)
    {
        productsQuery = productsQuery.Where(p =>
            p.Quantity <= 5);
    }

    // 3. Count
    // Count AFTER filtering.
    // This tells us how many matching products exist.
    var totalItems = await productsQuery.CountAsync();

    // Calculate the number of pages.
    var totalPages = (int)Math.Ceiling(
        totalItems / (double)query.PageSize);

    // 4. Sorting
    // again embedded query for the same
    productsQuery = query.SortBy?.ToLower() switch
    {
        "name" => query.SortOrder?.ToLower() == "desc"
            ? productsQuery.OrderByDescending(p => p.Name)
            : productsQuery.OrderBy(p => p.Name),

        "price" => query.SortOrder?.ToLower() == "desc"
            ? productsQuery.OrderByDescending(p => p.Price)
            : productsQuery.OrderBy(p => p.Price),

        "quantity" => query.SortOrder?.ToLower() == "desc"
            ? productsQuery.OrderByDescending(p => p.Quantity)
            : productsQuery.OrderBy(p => p.Quantity),

        _ => productsQuery.OrderBy(p => p.Id)
    };

    // 5. Pagination
    // it skips over to show items for appropriate pages
    var products = await productsQuery
        .Skip((query.Page - 1) * query.PageSize)
        .Take(query.PageSize)
        .Select(p => new ProductResponseDto
        {
            Id = p.Id,
            Name = p.Name,
            Quantity = p.Quantity,
            Price = p.Price,
            CategoryId = p.CategoryId,
            CategoryName = p.Category!.Name,
            CreatedDate = p.CreatedDate,
            UpdatedDate = p.UpdatedDate
        })
        .ToListAsync();

    // 6. Response
    return new ProductPagedResponseDto
    {
        Items = products,
        Page = query.Page,
        PageSize = query.PageSize,
        TotalItems = totalItems,
        TotalPages = totalPages
    };
}

public async Task<ProductResponseDto?> GetByIdAsync(int id)
{
    return await _context.Products
        .Include(p => p.Category)
        .Where(p => p.Id == id)
        .Select(p => new ProductResponseDto
        {
            Id = p.Id,
            Name = p.Name,
            Quantity = p.Quantity,
            Price = p.Price,
            CategoryId = p.CategoryId,
            CategoryName = p.Category!.Name,
            CreatedDate = p.CreatedDate,
            UpdatedDate = p.UpdatedDate
        })
        .FirstOrDefaultAsync();
}

public async Task<ProductResponseDto> CreateAsync(CreateProductDto dto)
{
    var categoryExists = await _context.Categories
        .FirstOrDefaultAsync(c => c.Id == dto.CategoryId);

    if (categoryExists is null )
    {
        throw new ArgumentException("Category does not exist.");
    }

    var product = new Product
    {
        Name = dto.Name,
        Quantity = dto.Quantity,
        Price = dto.Price,
        CategoryId = dto.CategoryId,
        CreatedDate = DateTime.UtcNow,
        UpdatedDate = DateTime.UtcNow
    };

    // at this point ef core begins to track this new identity
    _context.Products.Add(product);

    // actual insertion in db
    await _context.SaveChangesAsync();

    //Map directly from memory to save a whole DB query
    return new ProductResponseDto
    {
        Id = product.Id,
        Name = product.Name,
        Quantity = product.Quantity,
        Price = product.Price,
        CategoryId = product.CategoryId,
        CategoryName = categoryExists.Name,     // Reused from our verification variable
        CreatedDate = product.CreatedDate,
        UpdatedDate = product.UpdatedDate
    };
}

public async Task<ProductResponseDto?> UpdateAsync(
    int id,
    UpdateProductDto dto)
{
    var product = await _context.Products
        .FirstOrDefaultAsync(p => p.Id == id);

    if (product is null)
    {
        return null;
    }

    var categoryExists = await _context.Categories
        .FirstOrDefaultAsync(c => c.Id == dto.CategoryId);

    if (categoryExists is null)
    {
        throw new ArgumentException("Category does not exist.");
    }

    product.Name = dto.Name;
    product.Quantity = dto.Quantity;
    product.Price = dto.Price;
    product.CategoryId = dto.CategoryId;
    product.UpdatedDate = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return new ProductResponseDto
    {
        Id = product.Id,
        Name = product.Name,
        Quantity = product.Quantity,
        Price = product.Price,
        CategoryId = product.CategoryId,
        CategoryName = categoryExists.Name,     //Safely reused from the variable above!
        CreatedDate = product.CreatedDate,
        UpdatedDate = product.UpdatedDate
    };
}

public async Task<bool> DeleteAsync(int id)
{
    var product = await _context.Products
        .FirstOrDefaultAsync(p => p.Id == id);

    if (product is null)
    {
        return false;
    }

    _context.Products.Remove(product);

    await _context.SaveChangesAsync();

    return true;
}}
