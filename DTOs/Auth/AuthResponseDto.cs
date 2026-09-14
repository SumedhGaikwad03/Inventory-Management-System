namespace InventoryApi.DTOs.Auth;

public class AuthResponseDto
{
    public int Id { get; set; }

    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }
}