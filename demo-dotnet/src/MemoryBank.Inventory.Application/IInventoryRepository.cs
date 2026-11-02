using MemoryBank.Inventory.Domain;

namespace MemoryBank.Inventory.Application;

public interface IInventoryRepository
{
    Task<IReadOnlyList<InventoryItem>> ListAsync(CancellationToken cancellationToken);
    Task<InventoryItem?> FindAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> SkuExistsAsync(string sku, Guid? excludingId, CancellationToken cancellationToken);
    Task AddAsync(InventoryItem item, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
    Task DeleteAsync(InventoryItem item, CancellationToken cancellationToken);
}