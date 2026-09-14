using Microsoft.AspNetCore.Identity;

namespace InventoryApi.Services.Auth;

public class PasswordHasher : IPasswordHasher
//PasswordHasher implements the IPasswordHasher interface.
{
    private readonly PasswordHasher<object> _hasher = new();
    //using microsoft built in hashing class and then creating an instance 
    //of it,  _hasher is our object 

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

        return result == PasswordVerificationResult.Success ||
               result == PasswordVerificationResult.SuccessRehashNeeded;
               // Return true if verification succeeded or if it succeeded but 
               // the hash should be upgraded.
    }
}