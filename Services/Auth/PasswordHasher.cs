using Microsoft.AspNetCore.Identity;

namespace InventoryApi.Services.Auth;

// PasswordHasher implements the IPasswordHasher interface.
public class PasswordHasher : IPasswordHasher
{
    // using microsoft built in hashing class and then creating an instance
    // of it, _hasher is our object
    private readonly PasswordHasher<object> _hasher = new();

    public string HashPassword(string password)
    {
        return _hasher.HashPassword(
            new object(),
            password);
    }

    public bool VerifyPassword(
        string password,
        string passwordHash)
    {
        var result = _hasher.VerifyHashedPassword(
            new object(),
            passwordHash,
            password);

        // Return true if verification succeeded or if it succeeded but
        // the hash should be upgraded.
        return result == PasswordVerificationResult.Success ||
               result == PasswordVerificationResult.SuccessRehashNeeded;
    }
}