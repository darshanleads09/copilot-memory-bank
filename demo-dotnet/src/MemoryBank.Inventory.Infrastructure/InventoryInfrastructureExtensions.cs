using MemoryBank.Inventory.Application;
using MemoryBank.Inventory.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace MemoryBank.Inventory.Infrastructure;

public static class InventoryInfrastructureExtensions
{
    public static IServiceCollection AddInventoryInfrastructure(this IServiceCollection services, string databasePath)
    {
        var directory = Path.GetDirectoryName(databasePath);
        if (!string.IsNullOrEmpty(directory))
            Directory.CreateDirectory(directory);

        services.AddDbContext<InventoryDbContext>(options => options.UseSqlite($"Data Source={databasePath}"));
        services.AddScoped<IInventoryRepository, SqliteInventoryRepository>();
        return services;
    }

    public static async Task InitializeInventoryDatabaseAsync(this IServiceProvider services, CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var context = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();
        await context.Database.EnsureCreatedAsync(cancellationToken);
        if (await context.InventoryItems.AnyAsync(cancellationToken))
            return;

        context.InventoryItems.AddRange(
            InventoryItem.Create("USB-C-HUB", "USB-C travel hub", 4, 69.99m),
            InventoryItem.Create("MON-STAND", "Monitor stand", 16, 42.50m),
            InventoryItem.Create("HDMI-2M", "HDMI cable, 2 m", 3, 12m));
        await context.SaveChangesAsync(cancellationToken);
    }
}