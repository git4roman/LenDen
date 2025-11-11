using Lenden.Core;
using Lenden.Core.SettlementFeatures;
using Lenden.Data.DbContexts;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.ApiControllers;

[ApiController]
[Route("api/[controller]")]
public class SettlementApiController: ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    public SettlementApiController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public class SettlementDto
    {
        public int FromUserId { get; set; }
        public int ToUserId { get; set; }
        public decimal Amount { get; set; }
    }

    [HttpPost("{groupId}")]
    public async Task<IActionResult> CreateSettlement(int groupId, SettlementDto dto)
    {
        var group = await _unitOfWork.Group.GetByIdAsync(groupId);
        if(group == null) return NotFound("group not found");
        
        var settlement = new SettlementEntity(groupId,dto.FromUserId, dto.ToUserId, dto.Amount);
        await _unitOfWork.Settlement.AddAsync(settlement);
        
        var balance = await _unitOfWork.Balance.GetBalanceByGroupAndUsersIdAsync(groupId, dto.FromUserId);
        if(balance == null) return BadRequest("balance not found");
        if (balance.OwedById == dto.FromUserId)
        {
            balance.Amount -= dto.Amount;
        }
        else
        {
            balance.Amount += dto.Amount;
        }
        
        await  _unitOfWork.SaveChangesAsync();
        return Ok();

    }
}