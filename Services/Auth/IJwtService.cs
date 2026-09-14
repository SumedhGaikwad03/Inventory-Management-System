using InventoryApi.Models;

namespace InventoryApi.Services.Auth;

public interface IJwtService
{
    string GenerateToken(User user);
}