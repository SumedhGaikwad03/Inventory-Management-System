using System.Text;

using InventoryApi.Data;
using InventoryApi.Exceptions;
using InventoryApi.Services.Auth;
using InventoryApi.Services.Categories;
using InventoryApi.Services.InventoryTransactions;
using InventoryApi.Services.Products;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


// ============================================================
// APPLICATION BUILDER
// ============================================================

var builder = WebApplication.CreateBuilder(args);

// this part here create an application builder


// ============================================================
// SERVICES
// ============================================================

builder.Services.AddControllers();
// we have added controller support
// tells asp core that controllers exists in this application

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// ============================================================
// DATABASE
// ============================================================

builder.Services.AddDbContext<InventoryDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));


// ============================================================
// APPLICATION SERVICES / DEPENDENCY INJECTION
// ============================================================

builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

builder.Services.AddScoped<IAuthService, AuthService>();
// Whenever something asks for IAuthService, give it an AuthService

builder.Services.AddScoped<IJwtService, JwtService>();

builder.Services.AddScoped<
    IInventoryTransactionService,
    InventoryTransactionService>();


// add scoped means that each request will get its own instance


// ============================================================
// EXCEPTION HANDLING
// ============================================================

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddProblemDetails();


// ============================================================
// OPENAPI
// ============================================================

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddOpenApi();
// this tells me there are things in my application


// ============================================================
// AUTHENTICATION
// ============================================================

builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtKey = builder.Configuration["Jwt:Key"];

        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new InvalidOperationException(
                "JWT key is not configured.");
        }

        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)),

                ValidateIssuer = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidateAudience = true,

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero
            };
    });


// ============================================================
// AUTHORIZATION
// ============================================================

builder.Services.AddAuthorization();


// ============================================================
// BUILD APPLICATION
// ============================================================

var app = builder.Build();

// at this point the application is built and ready to run


// ============================================================
// DATABASE SEEDING
// ============================================================

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context =
        services.GetRequiredService<InventoryDbContext>();

    var passwordHasher =
        services.GetRequiredService<IPasswordHasher>();

    await DbSeeder.SeedAsync(
        context,
        passwordHasher);
}


// ============================================================
// HTTP REQUEST PIPELINE
// ============================================================

app.UseExceptionHandler();
// this is exception handling middleware in the http pipeline


// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors("Frontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();


// ============================================================
// RUN APPLICATION
// ============================================================

app.Run();