using Lenden.Core;
using Lenden.Core.UserFeatures;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.ApiControllers;

[ApiController]
[Route("api/[controller]")]
public class UserApiController: ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    public UserApiController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(string email, string firstName, string lastName,string googleId)
    {
        try
        {
            var fullName = $"{firstName} {lastName}";
            var createdUser = new UserEntity(email, fullName,googleId);
           
            await _unitOfWork.User.AddAsync(createdUser);
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