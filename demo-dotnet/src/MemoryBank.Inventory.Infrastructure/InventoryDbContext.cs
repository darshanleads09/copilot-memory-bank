using MemoryBank.Inventory.Domain;
using Microsoft.EntityFrameworkCore;

namespace MemoryBank.Inventory.Infrastructure;

public sealed class InventoryDbContext(DbContextOptions<InventoryDbContext> options) : DbContext(options)
{
    public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var item = modelBuilder.Entity<InventoryItem>();
        item.ToTable("InventoryItems");
        item.HasKey(value => value.Id);
        item.Property(value => value.Id).ValueGeneratedNever();
        item.Property(value => value.Sku).HasMaxLength(32).IsRequired();
        item.HasIndex(value => value.Sku).IsUnique();
        item.Property(value => value.Name).HasMaxLength(120).IsRequired();
        item.Property(value => value.Quantity).IsRequired();
        item.Property(value => value.UnitPrice).HasPrecision(12, 2);
        item.Property(value => value.UpdatedAt).IsRequired();
    }
}