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

// 🔎 CLERK CONFIG
var clerkIssuer = builder.Configuration["Clerk:Issuer"];
var clerkAudience = builder.Configuration["Clerk:Audience"];

Console.WriteLine("=========== CLERK CONFIG DEBUG ===========");
Console.WriteLine("ISSUER: " + clerkIssuer);
Console.WriteLine("AUDIENCE: " + clerkAudience);
Console.WriteLine("===========================================");

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

        // важливо для Clerk – зберегти оригінальні назви клеймів
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
                Console.WriteLine("🔵 OnMessageReceived");

                var authHeader = context.Request.Headers["Authorization"].ToString();
                Console.WriteLine("Authorization Header: " + authHeader);

                if (authHeader?.StartsWith("Bearer ") == true)
                {
                    var token = authHeader.Substring("Bearer ".Length);

                    try
                    {
                        var handler = new JwtSecurityTokenHandler();
                        var jwt = handler.ReadJwtToken(token);

                        Console.WriteLine("------ TOKEN DEBUG ------");
                        Console.WriteLine("ISS: " + jwt.Issuer);
                        Console.WriteLine("AUD: " + string.Join(",", jwt.Audiences));
                        Console.WriteLine("EXP: " + jwt.ValidTo);
                        Console.WriteLine("-------------------------");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Token parse error: " + ex.Message);
                    }
                }

                return Task.CompletedTask;
            },

            OnTokenValidated = context =>
            {
                Console.WriteLine("🟢 TOKEN VALIDATED SUCCESSFULLY");

                foreach (var claim in context.Principal.Claims)
                {
                    Console.WriteLine($"CLAIM: {claim.Type} = {claim.Value}");
                }

                return Task.CompletedTask;
            },

            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("🔴 AUTHENTICATION FAILED");
                Console.WriteLine(context.Exception.ToString());
                return Task.CompletedTask;
            },

            OnChallenge = context =>
            {
                Console.WriteLine("🟠 CHALLENGE TRIGGERED");
                Console.WriteLine("Error: " + context.Error);
                Console.WriteLine("Description: " + context.ErrorDescription);
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

// 🔥 Головний лог усіх HTTP-запитів
app.Use(async (context, next) =>
{
    Console.WriteLine($"➡️ REQUEST: {context.Request.Method} {context.Request.Path}");
    await next();
});

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors(FrontendCorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers().RequireCors(FrontendCorsPolicy);

app.Run();

public partial class Program { }
