using Lenden.Core;
using Lenden.Core.BalanceFeatures;
using Lenden.Core.TransactionFeatures;
using Lenden.Core.UserFeatures;
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


    [HttpGet]
    public async Task<IActionResult> GetTransactions(int groupId)
    {
        var existingGroup = await _context.Groups.FirstOrDefaultAsync(g => g.Id == groupId);
        if (existingGroup == null) return NotFound();
        var transactions = await _context.Transactions.Include(t=>t.PaidByUser).Where(t=>t.GroupId == groupId).ToListAsync();    
        return Ok(transactions);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTransaction(CreateTransactionModel  model)
    {
        try
        {
            var existingGroupId = await _unitOfWork.Group.GetByIdAsync(model.GroupId);
            if (existingGroupId == null) return NotFound("Group not found");
            var existingUser = await _unitOfWork.User.GetByIdAsync(model.PayedByUserId);
            if (model.PayedByUserId == null) return NotFound("Payed By user not found");

            var createdTransaction = new TransactionEntity(model.GroupId, model.PayedByUserId, model.Amount);
            await _unitOfWork.Transaction.AddAsync(createdTransaction);
            
            // int[] members = new int[] { 1, 2, 3 };
            
            List<UserEntity> membersObject = await _context.UserGroups.Include(ug=>ug.User).Where(ug=>ug.GroupId == model.GroupId).Select(ug=>ug.User).ToListAsync();
            int[] members = membersObject.Select(m=>m.Id).ToArray();
            double unitAmount = model.Amount/members.Length;
            foreach ( int member in members)
            {
                if (member == model.PayedByUserId)
                {
                    continue;
                }
                int ownerId = Math.Min(model.PayedByUserId, member);
                int owedById = Math.Max(model.PayedByUserId, member);
                
                var balance =await _context.Balances.FirstOrDefaultAsync(b => 
                    b.GroupId == model.GroupId && 
                    b.OwnerId == ownerId && 
                    b.OwedById == owedById);

                if (balance == null)
                {
                    var newBalance = new BalanceEntity(model.GroupId, ownerId,owedById, unitAmount);
                    await _unitOfWork.Balance.AddAsync(newBalance);
                    
                }
                else
                {
                    if (model.PayedByUserId == ownerId)
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
    
    public class CreateTransactionModel
    {
        public int GroupId { get; set; }
        public int PayedByUserId { get; set; }
        public double Amount { get; set; }
    }
}