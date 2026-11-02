using MemoryBank.Inventory.Domain;
using Microsoft.AspNetCore.Diagnostics;

namespace MemoryBank.Inventory.Api;

public sealed class ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        var (status, title, detail) = exception switch
        {
            InventoryItemNotFoundException => (StatusCodes.Status404NotFound, "Inventory item not found", exception.Message),
            DuplicateInventorySkuException => (StatusCodes.Status409Conflict, "SKU already exists", exception.Message),
            InventoryValidationException => (StatusCodes.Status400BadRequest, "Invalid inventory item", exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "Unexpected error", "An unexpected error occurred.")
        };

        if (status == StatusCodes.Status500InternalServerError)
            logger.LogError(exception, "Unhandled inventory API exception");

        context.Response.StatusCode = status;
        await Results.Problem(statusCode: status, title: title, detail: detail).ExecuteAsync(context);
        return true;
    }
}