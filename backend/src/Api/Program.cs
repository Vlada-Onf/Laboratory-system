using Api.Auth;
using Api.Filters;
using Application;
using FluentValidation;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

const string FrontendCorsPolicy = "FrontendCorsPolicy";
const string ClerkAuthenticationScheme = JwtBearerDefaults.AuthenticationScheme;

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();
});

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

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

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
        options.Authority = normalizedClerkIssuer;
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;

        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuers = validIssuers,

            ValidateAudience = true,
            ValidAudiences = new[]
            {
                clerkAudience,
                "laboratory-api"
            },

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),

            ValidateIssuerSigningKey = true
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {

                var authHeader = context.Request.Headers["Authorization"].ToString();

                if (authHeader?.StartsWith("Bearer ") == true)
                {
                    var token = authHeader.Substring("Bearer ".Length);
                    var handler = new JwtSecurityTokenHandler();
                    var jwt = handler.ReadJwtToken(token);

                }

                return Task.CompletedTask;
            },

            OnTokenValidated = context =>
            {
                return Task.CompletedTask;
            },

            OnAuthenticationFailed = context =>
            {
                return Task.CompletedTask;
            },

            OnChallenge = context =>
            {
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddScoped<IAuthorizationHandler, SuperAdminHandler>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SuperAdminOnly", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.AddRequirements(new SuperAdminRequirement());
    });
});

builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();

app.Use(async (context, next) =>
{
    Console.WriteLine($"➡️ REQUEST: {context.Request.Method} {context.Request.Path}");

    if (context.Request.Path.StartsWithSegments("/schematics"))
    {
        Console.WriteLine("📐 Schematic request hit API");
    }

    try
    {
        await next();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"💥 ERROR: {ex.GetType().Name} - {ex.Message}");
        Console.WriteLine(ex.StackTrace);
        throw;
    }
});

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors(FrontendCorsPolicy);

/*app.UseAuthentication();
app.UseAuthorization();*/

app.MapControllers().RequireCors(FrontendCorsPolicy);

app.Run();

public partial class Program { }
