using MemoryBank.Inventory.Application;
using Microsoft.AspNetCore.Mvc;

namespace MemoryBank.Inventory.Api.Controllers;

[ApiController]
[Route("api/inventory")]
public sealed class InventoryController(InventoryService inventoryService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<InventoryItemResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<InventoryItemResponse>>> List(CancellationToken cancellationToken)
    {
        var items = await inventoryService.ListAsync(cancellationToken);
        return Ok(items.Select(InventoryItemResponse.From).ToList());
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(InventoryItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InventoryItemResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await inventoryService.GetAsync(id, cancellationToken);
        return Ok(InventoryItemResponse.From(item));
    }

    [HttpPost]
    [ProducesResponseType(typeof(InventoryItemResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<InventoryItemResponse>> Create(
        InventoryItemRequest request,
        CancellationToken cancellationToken)
    {
        var item = await inventoryService.CreateAsync(
            request.Sku, request.Name, request.Quantity, request.UnitPrice, cancellationToken);
        var response = InventoryItemResponse.From(item);
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, response);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(InventoryItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<InventoryItemResponse>> Update(
        Guid id,
        InventoryItemRequest request,
        CancellationToken cancellationToken)
    {
        var item = await inventoryService.UpdateAsync(
            id, request.Sku, request.Name, request.Quantity, request.UnitPrice, cancellationToken);
        return Ok(InventoryItemResponse.From(item));
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await inventoryService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}