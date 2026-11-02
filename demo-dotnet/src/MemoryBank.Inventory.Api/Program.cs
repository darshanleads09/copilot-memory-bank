using MemoryBank.Inventory.Api;
using MemoryBank.Inventory.Application;
using MemoryBank.Inventory.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();
builder.Services.AddHealthChecks();
builder.Services.AddScoped<InventoryService>();
builder.Services.AddInventoryInfrastructure(Path.Combine(builder.Environment.ContentRootPath, "App_Data", "inventory.db"));

var app = builder.Build();

await app.Services.InitializeInventoryDatabaseAsync();

app.UseExceptionHandler();
if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseHttpsRedirection();
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
