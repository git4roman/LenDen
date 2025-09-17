using Lenden.Core;
using Lenden.Core.BalanceFeatures;
using Lenden.Core.TransactionFeatures;
using Lenden.Data;
using Lenden.Data.DbContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Web.ApiControllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionApiController:ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly AppDbContext _context;
    public TransactionApiController(IUnitOfWork unitOfWork, AppDbContext context)
    {
        _unitOfWork = unitOfWork;
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTransaction(int groupId, int payedByuserId, double amount)
    {
        try
        {
            var existingGroupId = await _unitOfWork.Group.GetByIdAsync(groupId);
            if (existingGroupId == null) return NotFound("Group not found");
            var existingUser = await _unitOfWork.User.GetByIdAsync(payedByuserId);
            if (payedByuserId == null) return NotFound("Payed By user not found");

            var createdTransaction = new TransactionEntity(groupId, payedByuserId, amount);
            await _unitOfWork.Transaction.AddAsync(createdTransaction);
            
            int[] members = new int[] { 1, 2, 3 };
            double unitAmount = amount/members.Length;
            foreach ( int member in members)
            {
                if (member == payedByuserId)
                {
                    continue;
                }
                int ownerId = Math.Min(payedByuserId, member);
                int owedById = Math.Max(payedByuserId, member);
                
                var balance =await _context.Balances.FirstOrDefaultAsync(b => 
                    b.GroupId == groupId && 
                    b.OwnerId == ownerId && 
                    b.OwedById == owedById);

                if (balance == null)
                {
                    var newBalance = new BalanceEntity(groupId, ownerId,owedById, unitAmount);
                    await _unitOfWork.Balance.AddAsync(newBalance);
                    
                }
                else
                {
                    if (payedByuserId == ownerId)
                    {
                        balance.Amount += unitAmount;
                    }
                    else
                    {
                        balance.Amount -= unitAmount;
                    }
                    await _unitOfWork.Balance.Update(balance);
                }
            }
            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }

    }
}