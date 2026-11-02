namespace MemoryBank.Inventory.Domain;

public sealed class InventoryValidationException(string message) : Exception(message);

public sealed class DuplicateInventorySkuException(string sku)
    : Exception($"An inventory item with SKU '{sku}' already exists.");

public sealed class InventoryItemNotFoundException(Guid id)
    : Exception($"Inventory item '{id}' was not found.");