using MemoryBank.Inventory.Application;
using MemoryBank.Inventory.Domain;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace MemoryBank.Inventory.Infrastructure;

public sealed class SqliteInventoryRepository(InventoryDbContext context) : IInventoryRepository
{
    public async Task<IReadOnlyList<InventoryItem>> ListAsync(CancellationToken cancellationToken) =>
        await context.InventoryItems.AsNoTracking().OrderBy(item => item.Sku).ToListAsync(cancellationToken);

    public Task<InventoryItem?> FindAsync(Guid id, CancellationToken cancellationToken) =>
        context.InventoryItems.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);

    public Task<bool> SkuExistsAsync(string sku, Guid? excludingId, CancellationToken cancellationToken)
    {
        var query = context.InventoryItems.Where(item => item.Sku == sku);
        if (excludingId.HasValue)
            query = query.Where(item => item.Id != excludingId.Value);
        return query.AnyAsync(cancellationToken);
    }

    public async Task AddAsync(InventoryItem item, CancellationToken cancellationToken)
    {
        context.InventoryItems.Add(item);
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqliteException { SqliteExtendedErrorCode: 2067 })
        {
            throw new DuplicateInventorySkuException(item.Sku);
        }
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) => context.SaveChangesAsync(cancellationToken);

    public async Task DeleteAsync(InventoryItem item, CancellationToken cancellationToken)
    {
        context.InventoryItems.Remove(item);
        await context.SaveChangesAsync(cancellationToken);
    }
}