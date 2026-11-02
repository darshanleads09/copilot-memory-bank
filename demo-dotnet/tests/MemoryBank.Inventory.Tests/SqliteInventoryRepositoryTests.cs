using MemoryBank.Inventory.Application;
using MemoryBank.Inventory.Domain;
using MemoryBank.Inventory.Infrastructure;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace MemoryBank.Inventory.Tests;

public sealed class SqliteInventoryRepositoryTests
{
    [Fact]
    public async Task AddAsync_PersistsItemsAndEnforcesUniqueSku()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<InventoryDbContext>().UseSqlite(connection).Options;

        await using var context = new InventoryDbContext(options);
        await context.Database.EnsureCreatedAsync();
        var repository = new SqliteInventoryRepository(context);
        var service = new InventoryService(repository);
        var created = await service.CreateAsync("dock-01", "USB-C dock", 5, 129.95m);

        await using var verificationContext = new InventoryDbContext(options);
        var persisted = await verificationContext.InventoryItems.SingleAsync();
        Assert.Equal(created.Id, persisted.Id);
        Assert.Equal("DOCK-01", persisted.Sku);

        var duplicate = InventoryItem.Create("dock-01", "Duplicate dock", 1, 99m);
        await Assert.ThrowsAsync<DuplicateInventorySkuException>(() => repository.AddAsync(duplicate, default));
    }
}