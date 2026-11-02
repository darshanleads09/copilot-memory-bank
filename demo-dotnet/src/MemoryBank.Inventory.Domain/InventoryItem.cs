namespace MemoryBank.Inventory.Domain;

public sealed class InventoryItem
{
    private InventoryItem()
    {
        Sku = string.Empty;
        Name = string.Empty;
    }

    private InventoryItem(string sku, string name, int quantity, decimal unitPrice)
    {
        Id = Guid.NewGuid();
        Sku = sku;
        Name = name;
        Quantity = quantity;
        UnitPrice = unitPrice;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public Guid Id { get; private set; }
    public string Sku { get; private set; }
    public string Name { get; private set; }
    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }

    public static string NormalizeSku(string sku) => sku.Trim().ToUpperInvariant();

    public static InventoryItem Create(string sku, string name, int quantity, decimal unitPrice)
    {
        var normalizedSku = NormalizeSku(sku ?? string.Empty);
        var normalizedName = name?.Trim() ?? string.Empty;

        if (normalizedSku.Length is 0 or > 32)
            throw new InventoryValidationException("SKU must contain between 1 and 32 characters.");
        if (normalizedName.Length is 0 or > 120)
            throw new InventoryValidationException("Name must contain between 1 and 120 characters.");
        if (quantity < 0)
            throw new InventoryValidationException("Quantity cannot be negative.");
        if (unitPrice < 0 || unitPrice > 9_999_999_999.99m || decimal.Round(unitPrice, 2) != unitPrice)
            throw new InventoryValidationException("Unit price must be between 0 and 9,999,999,999.99 with at most two decimal places.");

        return new InventoryItem(normalizedSku, normalizedName, quantity, unitPrice);
    }

    public void Update(string sku, string name, int quantity, decimal unitPrice)
    {
        var updated = Create(sku, name, quantity, unitPrice);
        Sku = updated.Sku;
        Name = updated.Name;
        Quantity = updated.Quantity;
        UnitPrice = updated.UnitPrice;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}