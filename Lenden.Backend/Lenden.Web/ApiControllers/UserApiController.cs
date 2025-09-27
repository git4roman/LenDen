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

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _unitOfWork.User.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user  = await _unitOfWork.User.GetByIdAsync(id);
        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(string email, string fullName,string googleId,string pictureUrl)
    {
        try
        {
            // var fullName = $"{firstName} {lastName}";
            var createdUser = new UserEntity(email,fullName,googleId,pictureUrl);
           
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