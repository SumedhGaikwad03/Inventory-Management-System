using InventoryApi.Data;
using InventoryApi.DTOs.Auth;
using InventoryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Services.Auth;

public class AuthService : IAuthService // AuthService implements the IAuthService interface.
// This means AuthService must provide the methods defined by IAuthService.

{
    private readonly InventoryDbContext _context; // we are defining the variable type to use later 
    private readonly IPasswordHasher _passwordHasher;
    
    private readonly IJwtService _jwtService; 
    

    // we declared three dependencies that this service needs 

    public AuthService(
        InventoryDbContext context,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    } 

   // Constructor receives the dependencies through Dependency Injection
// and stores them in private fields so AuthService can use them.
// Depending on interfaces helps keep AuthService loosely coupled
// to specific implementations.
    

    public async Task<AuthResponseDto> SignupAsync( // async method that performs an asynchronous operation
// and eventually returns an AuthResponseDto.
        SignupRequestDto dto)
    {
        // Check whether the username is already taken.
        var usernameExists = await _context.Users
            .AnyAsync(u => u.Username == dto.Username);

        if (usernameExists)
        {
            throw new ArgumentException(
                "A user with this username already exists.");
        }

        // Hash the password before creating the database entity.
        var passwordHash = _passwordHasher.HashPassword(dto.Password);

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = passwordHash,
            CreatedDate = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        // Never return the password or password hash.
        return new AuthResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            CreatedDate = user.CreatedDate
        };
    }

 

public async Task<LoginResponseDto> LoginAsync(
    LoginRequestDto dto)
{
    // Find the user by username.
    var user = await _context.Users
        .FirstOrDefaultAsync(u => u.Username == dto.Username);

    // Do not reveal whether the username or password was wrong.
    if (user is null)
    {
        throw new UnauthorizedAccessException(
            "Invalid username or password.");
    }

    // Verify the entered password against the stored hash.
    var passwordIsValid = _passwordHasher.VerifyPassword(
        dto.Password,
        user.PasswordHash);

    if (!passwordIsValid)
    {
        throw new UnauthorizedAccessException(
            "Invalid username or password.");
    }

    // The credentials are valid, so generate a JWT.
    var token = _jwtService.GenerateToken(user);

    return new LoginResponseDto
    {
        Token = token
    };
}
}