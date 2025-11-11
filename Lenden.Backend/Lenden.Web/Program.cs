using System.Text;
using Lenden.Core;
using Lenden.Core.GroupFeatures;
using Lenden.Core.SettlementFeatures;
using Lenden.Core.TransactionFeatures;
using Lenden.Core.UserFeatures;
using Lenden.Core.Utilities;
using Lenden.Data;
using Lenden.Data.DbContexts;
using Lenden.Data.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IGroupRepository, GroupRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ISettlementRepository, SettlementRepository>();
builder.Services.Configure<JwtService>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddScoped<CurrentUserHelper>();
builder.Services.AddScoped<PasswordHasher<UserEntity>>();


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanCreateExpense", policy =>
        policy.RequireRole("admin", "user"));
});

var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();


app.UseAuthentication();

app.UseAuthorization();



app.MapControllers(); 

app.Run();
