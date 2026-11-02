using System.ComponentModel.DataAnnotations;

namespace MemoryBank.Inventory.Api;

public sealed class InventoryItemRequest
{
    [Required]
    [StringLength(32, MinimumLength = 1)]
    public string Sku { get; init; } = string.Empty;

    [Required]
    [StringLength(120, MinimumLength = 1)]
    public string Name { get; init; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int Quantity { get; init; }

    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal UnitPrice { get; init; }
}

public sealed record InventoryItemResponse(
    Guid Id,
    string Sku,
    string Name,
    int Quantity,
    decimal UnitPrice,
    DateTimeOffset UpdatedAt)
{
    public static InventoryItemResponse From(MemoryBank.Inventory.Domain.InventoryItem item) =>
        new(item.Id, item.Sku, item.Name, item.Quantity, item.UnitPrice, item.UpdatedAt);
}