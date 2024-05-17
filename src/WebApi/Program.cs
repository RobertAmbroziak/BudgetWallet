using BusinessLogic.Abstractions;
using BusinessLogic.Services;
using BusinessLogic.Services.Mappers;
using DataAccessLayer;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Model.Application;
using Model.Identity;
using Model.Tables;
using System.Globalization;
using System.Reflection;
using System.Text;
using Util.Helpers;
using WebApi.Middlewares;
using WebApi.Validators;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddJsonFile("appsettings.json");
var configuration = builder.Configuration;
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => 
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins(new string[] { "https://budgetwallet.azurewebsites.net", "http://localhost:3000" })
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});


builder.Services.AddLocalization();
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[]
    {
        new CultureInfo("en-US"),
        new CultureInfo("pl-PL")
    };

    options.DefaultRequestCulture = new RequestCulture("en-US");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),
            ClockSkew = TimeSpan.Zero
        };
    });


builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IApplicationDbContext, ApplicationDbContext>();
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();
builder.Services.AddScoped<IIdentityService, IdentityService>();
builder.Services.AddScoped<IApplicationService, ApplicationService>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<IValidator<UserRegisterRequest>, UserRegisterRequestValidator>();
builder.Services.AddScoped<IValidator<PostTransfer>, PostTransferValidator>();
builder.Services.AddScoped<IValidator<PostTransfer>, PostTransferInternalValidator>();
//builder.Services.AddScoped<PostTransferValidator>();
//builder.Services.AddScoped<PostTransferInternalValidator>();

builder.Services.AddScoped<IValidator<Budget>, BudgetValidator>();

builder.Services.AddSingleton<IMapperService<BudgetDto, Budget>, BudgetMapper>();
builder.Services.AddSingleton<IMapperService<BudgetPeriodDto, BudgetPeriod>, BudgetPeriodMapper>();
builder.Services.AddSingleton<IMapperService<CategoryDto, Category>, CategoryMapper>();
builder.Services.AddSingleton<IMapperService<AccountDto, Account>, AccountMapper>();
builder.Services.AddSingleton<IMapperService<PostTransfer, TransferDto>, PostTransferMapper>();

builder.Services.AddScoped<IDateTimeProvider, DateTimeProvider>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API V1");
    });

    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();
            context.Database.Migrate();
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while migrating the database.");
        }
    }
}
app.UseCors("AllowSpecificOrigin");
app.UseHttpsRedirection();
app.UseMiddleware<LanguageMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
