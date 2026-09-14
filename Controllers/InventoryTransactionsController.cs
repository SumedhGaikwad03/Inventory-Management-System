using System.Security.Claims;
using InventoryApi.DTOs.InventoryTransactions;
using InventoryApi.Services.InventoryTransactions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class InventoryTransactionsController : ControllerBase
{
    private readonly IInventoryTransactionService _transactionService;

    public InventoryTransactionsController(
        IInventoryTransactionService transactionService)
    {
        _transactionService = transactionService;
    }


    // ============================================================
    // GET ALL TRANSACTIONS
    // ============================================================

    [HttpGet]
    public async Task<ActionResult<List<InventoryTransactionResponseDto>>>
        GetAll()
    {
        var transactions = await _transactionService.GetAllAsync();

        return Ok(transactions);
    }


    // ============================================================
    // GET TRANSACTIONS FOR ONE PRODUCT
    // ============================================================

    [HttpGet("product/{productId:int}")]
    public async Task<ActionResult<List<InventoryTransactionResponseDto>>>
        GetByProductId(int productId)
    {
        var transactions =
            await _transactionService.GetByProductIdAsync(productId);

        return Ok(transactions);
    }


    // ============================================================
    // CREATE INVENTORY TRANSACTION
    // ============================================================

    [HttpPost]
    public async Task<ActionResult<InventoryTransactionResponseDto>> Create(
        [FromBody] CreateInventoryTransactionDto dto)
    {
        // Get the authenticated user's ID from the JWT.
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var transaction =
            await _transactionService.CreateAsync(
                dto.ProductId,
                userId,
                dto.QuantityChanged,
                dto.TransactionType);

        return Ok(transaction);
    }


    [HttpGet("{id:int}")]
public async Task<ActionResult<InventoryTransactionResponseDto>>
    GetById(int id)
{
    var transaction =
        await _transactionService.GetByIdAsync(id);

    if (transaction is null)
    {
        return NotFound();
    }

    return Ok(transaction);
}
}