using Api.Filters;
using Application;
using FluentValidation;
using Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Controllers + глобальна валідація
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();  // підключили фільтр
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Application + Infrastructure
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// Реєструємо всі FluentValidation-валідатори з цього асемблі
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
app.UseSwagger();
app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

public partial class Program { }
