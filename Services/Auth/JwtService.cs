using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using InventoryApi.Models;
using Microsoft.IdentityModel.Tokens;

namespace InventoryApi.Services.Auth;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration; // allows to read and configure values 

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
  //  this is simple DI injection 
    public string GenerateToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"];

        if (string.IsNullOrWhiteSpace(jwtKey)) // reads form env
        {
            throw new InvalidOperationException(
                "JWT key is not configured.");// JWT key should be provided through application configuration/environment.
// Fail immediately if it is missing.
        }

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)); 
            // converts secret to a signing key 

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256); 
            // use the sign key and this  algorithm to sign the token 


        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()),

            new Claim(
                ClaimTypes.Name,
                user.Username),

            new Claim(
                ClaimTypes.Role,
                user.Role)
            
        }; //Information about the authenticated user that gets carried inside the token.

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                _configuration.GetValue<int>("Jwt:ExpiryMinutes")),
            signingCredentials: credentials
        ); // this creates an actual jwt object 

        return new JwtSecurityTokenHandler()
            .WriteToken(token); // this returns the jwt object 
    }
}