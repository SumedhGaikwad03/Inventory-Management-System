using InventoryApi.DTOs.Products;
using InventoryApi.Services.Products;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace InventoryApi.Controllers;

// Tells ASP.NET Core that this class is an API controller.
// It also enables automatic model validation and other API-specific behavior.
[ApiController]
[Authorize] // This attribute requires authentication for all endpoints
//  in this controller.

// [controller] is replaced by the controller's name.
// ProductsController → /api/products
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    // Dependency Injection.
    // The ASP.NET Core DI container provides the implementation
    // of IProductService when it creates this controller.
    public ProductsController(IProductService productService)
    {
        _productService = productService;

        // We don't create ProductService ourselves with "new".
        // ASP.NET Core creates it and gives it to us.
    }


    // GET: /api/products
    // Gets all products.
    [HttpGet]
    public async Task<ActionResult<List<ProductResponseDto>>> GetAll( [FromQuery] ProductQueryDto query)
    {
        // Ask the service to retrieve the products.
        // The controller doesn't talk directly to the database.
        var products = await _productService.GetAllAsync(query);

        // Return HTTP 200 OK with the products as JSON.
        return Ok(products);
    }


    // GET: /api/products/{id}
    // Example: GET /api/products/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductResponseDto>> GetById(int id)
    {
        // Ask the service for the product with this ID.
        var product = await _productService.GetByIdAsync(id);

        // If the service couldn't find the product,
        // return HTTP 404 Not Found.
        if (product == null)
        {
            return NotFound();
        }

        // Product exists, so return HTTP 200 OK.
        return Ok(product);
    }


    // POST: /api/products
    // Creates a new product.
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductResponseDto>> Create(
        CreateProductDto dto)
    {
        // The DTO contains the data sent by the client.
        // The service handles the actual creation/business logic.
        var product = await _productService.CreateAsync(dto);

        // Return HTTP 201 Created.
        //
        // nameof(GetById)
        //     tells ASP.NET Core which endpoint can retrieve the new resource.
        //
        // new { id = product.Id }
        //     provides the ID for that endpoint.
        //
        // product
        //     is the newly created resource returned in the response body.
        return CreatedAtAction(
            nameof(GetById),
            new { id = product.Id },
            product);
    }


    // PUT: /api/products/{id}
    // Example: PUT /api/products/5
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductResponseDto>> Update(
        int id,
        UpdateProductDto dto)
    {
        // Ask the service to update the product.
        var product = await _productService.UpdateAsync(id, dto);

        // If the product doesn't exist, return HTTP 404.
        if (product is null)
        {
            return NotFound();
        }

        // Update was successful, so return HTTP 200 OK
        // with the updated product.
        return Ok(product);
    }


    // DELETE: /api/products/{id}
    // Example: DELETE /api/products/5
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        // Ask the service to delete the product.
        var deleted = await _productService.DeleteAsync(id);

        // If no product existed with this ID,
        // return HTTP 404 Not Found.
        if (!deleted)
        {
            return NotFound();
        }

        // Delete succeeded.
        // 204 means the operation succeeded but there is
        // no response body to return.
        return NoContent();
    }
}