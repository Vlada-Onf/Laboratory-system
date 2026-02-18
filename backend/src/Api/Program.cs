using Api.Auth;
using Api.Filters;
using Application;
using FluentValidation;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// константи
const string FrontendCorsPolicy = "FrontendCorsPolicy";
const string ClerkAuthenticationScheme = JwtBearerDefaults.AuthenticationScheme;

// Controllers + глобальна валідація
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

// Authentication (JWT від Clerk)
var clerkIssuer = builder.Configuration["Clerk:Issuer"];
var clerkAudience = builder.Configuration["Clerk:Audience"];

if (string.IsNullOrWhiteSpace(clerkIssuer))
{
    throw new InvalidOperationException("Missing Clerk configuration value 'Clerk:Issuer'.");
}

var normalizedClerkIssuer = clerkIssuer.TrimEnd('/');
var validIssuers = new[] { normalizedClerkIssuer, $"{normalizedClerkIssuer}/" };

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = ClerkAuthenticationScheme;
        options.DefaultChallengeScheme = ClerkAuthenticationScheme;
    })
    .AddJwtBearer(ClerkAuthenticationScheme, options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuers = validIssuers,
            ValidateAudience = false,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),

            ValidateIssuerSigningKey = true
        };
    });

// Authorization + policy SuperAdminOnly
builder.Services.AddScoped<IAuthorizationHandler, SuperAdminHandler>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SuperAdminOnly", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.AddRequirements(new SuperAdminRequirement());
    });
});

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseRouting();

// CORS між Routing та Auth
app.UseCors(FrontendCorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

// Endpoints + CORS
app.MapControllers().RequireCors(FrontendCorsPolicy);

app.Run();

public partial class Program { }
