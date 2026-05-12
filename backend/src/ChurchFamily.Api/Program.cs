using System.Text;
using ChurchFamily.Api.Endpoints;
using ChurchFamily.Api.Middleware;
using ChurchFamily.Api.Services;
using ChurchFamily.Application;
using ChurchFamily.Application.Common.Interfaces;
using ChurchFamily.Infrastructure;
using ChurchFamily.Infrastructure.Seeding;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// --- Service Registration ---

// Clean Architecture layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure();

// API services
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// OpenAPI (Scalar)
builder.Services.AddOpenApi();

// CORS — allow Angular dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:8888")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// --- Middleware Pipeline ---

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("Church Family Cloud API");
        options.WithTheme(ScalarTheme.BluePlanet);
    });
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// --- Endpoint Mapping ---

app.MapHouseholdEndpoints();
app.MapFundEndpoints();
app.MapBatchEndpoints();
app.MapDonationEndpoints();
app.MapStewardshipEndpoints();
app.MapBroadcastEndpoints();
app.MapGroupEndpoints();
app.MapAuthEndpoints();

// --- Seed Database ---

await DataSeeder.SeedAsync(app.Services);

app.Run();
