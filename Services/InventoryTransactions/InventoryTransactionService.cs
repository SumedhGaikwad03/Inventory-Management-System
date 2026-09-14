using InventoryApi.Data;
using InventoryApi.DTOs.InventoryTransactions;
using InventoryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Services.InventoryTransactions;

public class InventoryTransactionService : IInventoryTransactionService
{
    private readonly InventoryDbContext _context; // geeting the  variable ready 

    public InventoryTransactionService(
        InventoryDbContext context)
    {
        _context = context;
    } // dependency injection happens over here 



    public async Task<InventoryTransactionResponseDto?> GetByIdAsync(int id)
{
    return await _context.InventoryTransactions
        .Include(t => t.Product)
        .Include(t => t.User)
        .Where(t => t.Id == id)
        .Select(t => new InventoryTransactionResponseDto
        {
            Id = t.Id,
            ProductId = t.ProductId,
            ProductName = t.Product.Name,
            UserId = t.UserId,
            Username = t.User.Username,
            QuantityChanged = t.QuantityChanged,
            TransactionType = t.TransactionType,
            CreatedDate = t.CreatedDate
        })
        .FirstOrDefaultAsync();
}


    // ============================================================
    // CREATE TRANSACTION
    // ============================================================

    public async Task<InventoryTransactionResponseDto> CreateAsync(
        int productId,
        int userId,
        int quantityChanged,
        string transactionType)
    {
        // Find the product whose inventory is being changed.
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId);

        var user = await _context.Users
    .FirstOrDefaultAsync(u => u.Id == userId);

     if (user is null)
{
    throw new ArgumentException("User not found.");
}    

        if (product is null)
        {
            throw new ArgumentException("Product not found.");
        }

        // Prevent the inventory from becoming negative.
        if (product.Quantity + quantityChanged < 0)
        {
            throw new ArgumentException(
                "Inventory quantity cannot be negative.");
        }

        // Create the transaction record.
        var transaction = new InventoryTransaction
        {
            ProductId = productId,
            UserId = userId,
            QuantityChanged = quantityChanged,
            TransactionType = transactionType,
            CreatedDate = DateTime.UtcNow
        };

        // Update the actual product quantity.
        product.Quantity += quantityChanged;

        // Add the transaction to the database.
        _context.InventoryTransactions.Add(transaction);

        // Save both changes together.
        await _context.SaveChangesAsync();

        // Return a DTO rather than exposing the entity.
        return new InventoryTransactionResponseDto
{
    Id = transaction.Id,
    ProductId = product.Id,
    ProductName = product.Name,
    UserId = userId,
    Username = user.Username,
    QuantityChanged = transaction.QuantityChanged,
    TransactionType = transaction.TransactionType,
    CreatedDate = transaction.CreatedDate
};
    }


    // ============================================================
    // GET ALL TRANSACTIONS
    // ============================================================

    public async Task<List<InventoryTransactionResponseDto>> GetAllAsync()
    {
        return await _context.InventoryTransactions
            .Include(t => t.Product)
            .Include(t => t.User)
            .Select(t => new InventoryTransactionResponseDto
            {
                Id = t.Id,
                ProductId = t.ProductId,
                ProductName = t.Product.Name,
                UserId = t.UserId,
                Username = t.User.Username,
                QuantityChanged = t.QuantityChanged,
                TransactionType = t.TransactionType,
                CreatedDate = t.CreatedDate
            })
            .OrderByDescending(t => t.CreatedDate)
            .ToListAsync();
    }


    // ============================================================
    // GET TRANSACTIONS FOR ONE PRODUCT
    // ============================================================

    public async Task<List<InventoryTransactionResponseDto>>
        GetByProductIdAsync(int productId)
    {
        return await _context.InventoryTransactions
            .Include(t => t.Product)
            .Include(t => t.User)
            .Where(t => t.ProductId == productId)
            .Select(t => new InventoryTransactionResponseDto
            {
                Id = t.Id,
                ProductId = t.ProductId,
                ProductName = t.Product.Name,
                UserId = t.UserId,
                Username = t.User.Username,
                QuantityChanged = t.QuantityChanged,
                TransactionType = t.TransactionType,
                CreatedDate = t.CreatedDate
            })
            .OrderByDescending(t => t.CreatedDate)
            .ToListAsync();
    }
}