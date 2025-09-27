using Lenden.Core;
using Lenden.Data.DbContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Web.ApiControllers;

[ApiController]
[Route("api/[controller]")]
public class BalanceApiController: ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly AppDbContext _context;
    public BalanceApiController(IUnitOfWork unitOfWork, AppDbContext context)
    {
        _unitOfWork = unitOfWork;
        _context = context;
    }

    [HttpGet("{groupId}/balance/{userId}")]
    public async Task<IActionResult> GetBalanceSummary(int groupId, int userId)
    {
        var group = await _unitOfWork.Group.GetByIdAsync(groupId);
        if (group == null) return NotFound();
        // var members = await _context.UserGroups.Include(u=> u.User).Where(u => u.GroupId == groupId).ToListAsync();
        double toCollect=0;
        double toPay = 0;
        
        var balances = await _context.Balances.Where(u=>(u.OwnerId == userId || u.OwedById == userId) && u.GroupId == groupId).ToListAsync();
        foreach (var balance in balances)
        {
            if (balance.OwnerId == userId)
            {
                if (balance.Amount > 0)
                {
                    toCollect += balance.Amount;
                }
                else
                {
                    toPay += Math.Abs(balance.Amount);
                }
            }
            else
            {
                if (balance.Amount < 0)
                {
                    toCollect += Math.Abs(balance.Amount);
                }
                else
                {
                    toPay += balance.Amount;
                }
            }
        }
        
        return Ok(new { toCollect = toCollect, toPay = toPay });

    }

    [HttpGet("{groupId}/mutual-balance/{userId}/")]
    public async Task<IActionResult> GetMutualBalance(int groupId, int userId)
    {
        var group = await _unitOfWork.Group.GetByIdAsync(groupId);  
        if (group == null) return NotFound();
        
        var balances = await _context.Balances.Where(u=>u.OwnerId == userId || u.GroupId == groupId).ToListAsync();
        var report = balances
            .Select(b => new
            {
                FromUser = b.Amount < 0 ? b.OwnerId : b.OwedById,
                ToUser   = b.Amount < 0 ? b.OwedById : b.OwnerId,
                Amount   = Math.Abs(b.Amount)
            })
            .Where(r => r.FromUser == userId || r.ToUser == userId)
            .ToList();

        return Ok(report);
    }
}