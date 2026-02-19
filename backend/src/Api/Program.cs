using Api.Auth;
using Api.Filters;
using Application;
using FluentValidation;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

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

//
// 🔎 CLERK CONFIG DEBUG
//
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
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuers = validIssuers,

            ValidateAudience = true,
            ValidAudience = clerkAudience,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),

            ValidateIssuerSigningKey = true
        };

        //
        // 🔥 JWT DEBUG EVENTS
        //
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                Console.WriteLine("🔵 OnMessageReceived");
                Console.WriteLine("Authorization Header: " + context.Request.Headers["Authorization"]);
                return Task.CompletedTask;
            },

            OnTokenValidated = context =>
            {
                Console.WriteLine("🟢 TOKEN VALIDATED SUCCESSFULLY");

                var claims = context.Principal?.Claims;
                if (claims != null)
                {
                    foreach (var claim in claims)
                    {
                        Console.WriteLine($"CLAIM: {claim.Type} = {claim.Value}");
                    }
                }

                return Task.CompletedTask;
            },

            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("🔴 AUTHENTICATION FAILED");
                Console.WriteLine("Exception: " + context.Exception);
                return Task.CompletedTask;
            },

            OnChallenge = context =>
            {
                Console.WriteLine("🟠 ON CHALLENGE");
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
