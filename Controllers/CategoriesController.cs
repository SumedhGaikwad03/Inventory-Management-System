using InventoryApi.DTOs.Categories;
using InventoryApi.Services.Categories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace InventoryApi.Controllers;

[ApiController]
[Authorize] // this means only the request with an vaild token has access to the code block below 
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;  // di injecttion of catgory 

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // GET: /api/categories
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<CategoryResponseDto>>> GetAll()
    {
        var categories = await _categoryService.GetAllAsync();

        return Ok(categories);
    }

    // GET: /api/categories/{id}
    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<ActionResult<CategoryResponseDto>> GetById(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    // POST: /api/categories
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryResponseDto>> Create(
        CreateCategoryDto dto)
    {
        var category = await _categoryService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = category.Id },
            category);
    }

    // PUT: /api/categories/{id}
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryResponseDto>> Update(
        int id,
        UpdateCategoryDto dto)
    {
        var category = await _categoryService.UpdateAsync(id, dto);

        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    // DELETE: /api/categories/{id}
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _categoryService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}