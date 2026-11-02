using MemoryBank.Inventory.Domain;

namespace MemoryBank.Inventory.Application;

public sealed class InventoryService(IInventoryRepository repository)
{
    public Task<IReadOnlyList<InventoryItem>> ListAsync(CancellationToken cancellationToken = default) =>
        repository.ListAsync(cancellationToken);

    public async Task<InventoryItem> GetAsync(Guid id, CancellationToken cancellationToken = default) =>
        await repository.FindAsync(id, cancellationToken)
        ?? throw new InventoryItemNotFoundException(id);

    public async Task<InventoryItem> CreateAsync(
        string sku,
        string name,
        int quantity,
        decimal unitPrice,
        CancellationToken cancellationToken = default)
    {
        var safeSku = sku ?? string.Empty;
        var normalizedSku = InventoryItem.NormalizeSku(safeSku);
        if (await repository.SkuExistsAsync(normalizedSku, null, cancellationToken))
            throw new DuplicateInventorySkuException(normalizedSku);

        var item = InventoryItem.Create(safeSku, name, quantity, unitPrice);
        await repository.AddAsync(item, cancellationToken);
        return item;
    }

    public async Task<InventoryItem> UpdateAsync(
        Guid id,
        string sku,
        string name,
        int quantity,
        decimal unitPrice,
        CancellationToken cancellationToken = default)
    {
        var item = await GetAsync(id, cancellationToken);
        var safeSku = sku ?? string.Empty;
        var normalizedSku = InventoryItem.NormalizeSku(safeSku);
        if (await repository.SkuExistsAsync(normalizedSku, id, cancellationToken))
            throw new DuplicateInventorySkuException(normalizedSku);

        item.Update(safeSku, name, quantity, unitPrice);
        await repository.SaveChangesAsync(cancellationToken);
        return item;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await GetAsync(id, cancellationToken);
        await repository.DeleteAsync(item, cancellationToken);
    }
}