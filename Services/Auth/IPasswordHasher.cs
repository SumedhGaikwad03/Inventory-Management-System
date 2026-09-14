namespace InventoryApi.Services.Auth;

public interface IPasswordHasher
{
    string HashPassword(string password);

    bool VerifyPassword(string password, string passwordHash);
}

// these two funntion hash as well as verfies them 
