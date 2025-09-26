using Lenden.Core;
using Lenden.Core.GroupFeatures;
using Lenden.Core.UserGroupFeatures;
using Lenden.Core.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.ApiControllers;

[ApiController]
[Route("api/[controller]")] // uses controller name = group
public class GroupApiController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly CurrentUserHelper  _currentUserHelper;

    public GroupApiController(IUnitOfWork unitOfWork,CurrentUserHelper currentUserHelper)
    {
        _unitOfWork = unitOfWork;
        _currentUserHelper = currentUserHelper;
    }
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var userInfo = _currentUserHelper.GetUserInfo();
       // var groups = await _unitOfWork.Group.GetAllAsync();
       var groups = await _unitOfWork.Group.GetGroupsByUserId(userInfo.Id?? 0);
        return Ok(groups);
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateGroup(GroupDto dto)
    {
        var userId = _currentUserHelper.GetUserId();

        if (!userId.HasValue)
        {
            return Unauthorized("User ID not found in token.");
        }
        var createdGroup = new GroupEntity(dto.Name, dto.ImageUrl, userId?? dto.CreatedBy);
        await _unitOfWork.Group.AddAsync(createdGroup);
        await _unitOfWork.SaveChangesAsync();
        await AddUsersInternal(userId.Value, createdGroup.Id);
        await _unitOfWork.SaveChangesAsync();
        
        return Ok();
    }
    
    private async Task AddUsersInternal(int userId, int groupId)
    {
            var newUser = new UserGroupEntity(userId, groupId);
            await _unitOfWork.UserGroup.AddAsync(newUser);
        
    }

    [HttpGet("{id}/get-group")]
    public async Task<IActionResult> GetGroupByIdAsync(int id)
    {
        var group = await _unitOfWork.Group.GetByIdAsync(id);
        return  Ok(group);
    }
    
    [Authorize]
    [HttpPut("{id}/update")]
    public async Task<IActionResult> UpdateGroup(int id,[FromBody] string name)
    {
        try
        {
            var existingGroup = await _unitOfWork.Group.GetByIdAsync(id);
            if (existingGroup == null) throw new Exception("Group not found");
            existingGroup.Name = name;
            existingGroup.ImageUrl = "Updated Image Url";
            await _unitOfWork.Group.Update(existingGroup);
            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
    
    [Authorize]
    [HttpPost("{id}/delete")]
    public async Task<IActionResult> RemoveGroup(int id)
    {
        try
        {
            var existingGroup = await _unitOfWork.Group.GetByIdAsync(id);
            if (existingGroup == null) throw new Exception("Group not found");
            await _unitOfWork.Group.RemoveAsync(existingGroup);
            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
    [Authorize]
    [HttpPost("{groupId}/addUsers")]
    public async Task<IActionResult> AddUsers(List<int> userIds, int groupId)
    {
        try
        {
            foreach (var userId in userIds)
            {
                var existingUser = await _unitOfWork.User.GetByIdAsync(userId);
                if (existingUser == null) continue;
                var newUser = new UserGroupEntity(userId, groupId);
                await _unitOfWork.UserGroup.AddAsync(newUser);
            }

            await _unitOfWork.SaveChangesAsync();
            return Ok();
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
        
    }
  
}