using Lenden.Core.ExpenseFeatures;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.ApiControllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ExpenseApiController: ControllerBase
{
    public ExpenseApiController()
    {
        
    }

    public class ExpenseDto
    {
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public List<UserAmountDto> PaidByDto { get; set; } = new();
        public List<UserAmountDto> SplitBetweenDto { get; set; } = new();
    }

    public class UserAmountDto
    {
        public int UserId { get; set; }
        public decimal Amount { get; set; }
    }
    
    
    
    [HttpPost]
    public IActionResult CreateExpense([FromBody] ExpenseDto expense)
    
    
}