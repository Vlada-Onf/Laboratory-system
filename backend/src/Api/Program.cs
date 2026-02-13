using Api.Filters;
using Application;
using FluentValidation;
using Infrastructure;

var builder = WebApplication.CreateBuilder(args);
const string FrontendCorsPolicy = "FrontendCorsPolicy";

// Controllers + דכמבאכüםא גאכ³האצ³ÿ
builder.Services.AddControllers(options =>
{
options.Filters.Add<ValidationFilter>();
});

// CORS
builder.Services.AddCors(options =>
{
options.AddPolicy(name: FrontendCorsPolicy, policy =>
{
policy
    .AllowAnyOrigin()     
    .AllowAnyHeader()
    .AllowAnyMethod();
});
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Application + Infrastructure
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();

// ÓÂ²ÌÊÍÓÒÈ swagger הכÿ גס³ץ סונוהמגטש (ף ע.ק. Render)
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(FrontendCorsPolicy);
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

public partial class Program { }
