using InventoryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Data;
// InventoryDbContext is the EF Core bridge between the Inventory API and the SQL Server database
public class InventoryDbContext : DbContext
// DbContext represents a session with the database.
// simply as "Create my database context called InventoryDbContext, and make it an EF Core DbContext"
{
    public InventoryDbContext(
        DbContextOptions<InventoryDbContext> options)
        : base(options) // options are basically configuration provided to the system
        // this is kinda configured in the program.cs file
    {
    }

    // These DbSets represent database tables.
    public DbSet<User> Users { get; set; } // DbSet represents collection of entities

    public DbSet<Category> Categories { get; set; }

    public DbSet<Product> Products { get; set; }

    public DbSet<InventoryTransaction> InventoryTransactions { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    // EF Core calls this method when the model is being created.
    // These are database rules that we define.
    // as how the c# models should map to the database tables
    // overriding the core ef db rules
    {
        base.OnModelCreating(modelBuilder);

        // USER
        modelBuilder.Entity<User>(entity =>
        {
            // Primary key
            entity.HasKey(u => u.Id);

            // Username must be unique
            entity.HasIndex(u => u.Username)
                .IsUnique();

            // Username is required and maximum 50 characters
            entity.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(50);

            // Password hash is required
            entity.Property(u => u.PasswordHash)
                .IsRequired();

            // Email is required and maximum 255 characters
            entity.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(255);

            // Role is required
            entity.Property(u => u.Role)
                .IsRequired()
                .HasMaxLength(20);

            // CreatedDate is required
            entity.Property(u => u.CreatedDate)
                .IsRequired();
        });

        // CATEGORY
        modelBuilder.Entity<Category>(entity =>
        {
            // Category name must be unique
            entity.HasIndex(c => c.Name)
                .IsUnique();

            entity.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(c => c.Description)
                .HasMaxLength(1000);
        });

        // CATEGORY -> PRODUCT
        // One Category can have many Products.
        // Each Product belongs to one Category.
        modelBuilder.Entity<Category>()
            .HasMany(c => c.Products)
            .WithOne(p => p.Category)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

            // the abstraction here is very high it's almost like english

        // Restrict means:
        // A Category cannot be deleted while Products
        // still reference that Category.

        // PRODUCT
        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(p => p.Price)
                .HasPrecision(18, 2);
        });

        // decimal(18,2)
        // 18 digits total
        // 2 digits after the decimal point
        //
        // Example:
        // 799.99
        // 1250.50

       // we have two initialisations of the same because EF Core's Fluent API is designed to configure one relationship at a time.

        // INVENTORY TRANSACTION
        modelBuilder.Entity<InventoryTransaction>(entity =>
        {
            entity.Property(t => t.TransactionType)
                .IsRequired()
                .HasMaxLength(20);
        });

        // INVENTORY TRANSACTION -> PRODUCT
        // One Product can have many InventoryTransactions.
        modelBuilder.Entity<InventoryTransaction>()
            .HasOne(t => t.Product)
            .WithMany(p => p.InventoryTransactions)
            .HasForeignKey(t => t.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // If a Product is deleted, its transaction records
        // are also deleted.

        // INVENTORY TRANSACTION -> USER
        // One User can create many InventoryTransactions.
        modelBuilder.Entity<InventoryTransaction>()
            .HasOne(t => t.User)
            .WithMany(u => u.InventoryTransactions)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // We don't want deleting a User to erase the historical
        // record of inventory changes they made.
    }
}
