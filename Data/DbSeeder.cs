using InventoryApi.Models;
using InventoryApi.Services.Auth;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(
        InventoryDbContext context,
        IPasswordHasher passwordHasher)
    {
        // Check whether an Admin already exists.
        var adminExists = await context.Users
            .AnyAsync(u => u.Username == "admin");

        // If an Admin already exists, do nothing.
        if (!adminExists)
        {
            // Create the initial Admin user.
            var admin = new User
            {
                Username = "admin",
                Email = "admin@inventory.local",

                
                // Never store the password directly.
                PasswordHash = passwordHasher.HashPassword(
                    "AdminPassword123!"),

                Role = "Admin",

                CreatedDate = DateTime.UtcNow
            };

            context.Users.Add(admin); // this loads the data into the c# level 
        }

        // Check whether a normal test user already exists.
        var userExists = await context.Users
            .AnyAsync(u => u.Username == "user");

        // If a normal user does not exist, create one.
        if (!userExists)
        {
            var user = new User
            {
                Username = "user",
                Email = "user@inventory.local",

                
                // Never store the password directly.
                PasswordHash = passwordHasher.HashPassword(
                    "UserPassword123!"),

                Role = "User",

                CreatedDate = DateTime.UtcNow
            };

            context.Users.Add(user); // this loads the data into the c# level 
        }

        await context.SaveChangesAsync(); // this actually makes chages to the db 
    }
}