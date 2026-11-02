using MemoryBank.Inventory.Application;
using MemoryBank.Inventory.Domain;

namespace MemoryBank.Inventory.Tests;

public sealed class InventoryServiceTests
{
    [Fact]
    public async Task CreateAsync_NormalizesSkuAndTrimsName()
    {
        var service = new InventoryService(new InMemoryInventoryRepository());

        var item = await service.CreateAsync(" cable-01 ", " USB cable ", 8, 4.25m);

        Assert.Equal("CABLE-01", item.Sku);
        Assert.Equal("USB cable", item.Name);
        Assert.Equal(8, item.Quantity);
    }

    [Fact]
    public async Task CreateAsync_RejectsDuplicateSkuIgnoringCase()
    {
        var service = new InventoryService(new InMemoryInventoryRepository());
        await service.CreateAsync("CABLE-01", "USB cable", 8, 4.25m);

        await Assert.ThrowsAsync<DuplicateInventorySkuException>(() =>
            service.CreateAsync("cable-01", "Another cable", 3, 5m));
    }

    [Fact]
    public async Task UpdateAsync_RejectsNegativeQuantity()
    {
        var service = new InventoryService(new InMemoryInventoryRepository());
        var item = await service.CreateAsync("CABLE-01", "USB cable", 8, 4.25m);

        await Assert.ThrowsAsync<InventoryValidationException>(() =>
            service.UpdateAsync(item.Id, "CABLE-01", "USB cable", -1, 4.25m));
    }

    [Fact]
    public async Task GetAsync_ThrowsWhenItemDoesNotExist()
    {
        var service = new InventoryService(new InMemoryInventoryRepository());

        await Assert.ThrowsAsync<InventoryItemNotFoundException>(() => service.GetAsync(Guid.NewGuid()));
    }

    private sealed class InMemoryInventoryRepository : IInventoryRepository
    {
        private readonly List<InventoryItem> _items = [];

        public Task<IReadOnlyList<InventoryItem>> ListAsync(CancellationToken cancellationToken) =>
            Task.FromResult<IReadOnlyList<InventoryItem>>(_items.OrderBy(item => item.Sku).ToList());

        public Task<InventoryItem?> FindAsync(Guid id, CancellationToken cancellationToken) =>
            Task.FromResult(_items.SingleOrDefault(item => item.Id == id));

        public Task<bool> SkuExistsAsync(string sku, Guid? excludingId, CancellationToken cancellationToken) =>
            Task.FromResult(_items.Any(item => item.Sku == sku && item.Id != excludingId));

        public Task AddAsync(InventoryItem item, CancellationToken cancellationToken)
        {
            _items.Add(item);
            return Task.CompletedTask;
        }

        public Task SaveChangesAsync(CancellationToken cancellationToken) => Task.CompletedTask;

        public Task DeleteAsync(InventoryItem item, CancellationToken cancellationToken)
        {
            _items.Remove(item);
            return Task.CompletedTask;
        }
    }
}