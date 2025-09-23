using Lenden.Core;
using Lenden.Core.GroupFeatures;
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

    [HttpGet]
    public async Task<IActionResult> Index()
    {
       var groups = await _unitOfWork.Group.GetAllAsync();
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
        var createdGroup = new GroupEntity(dto.Name, dto.ImageUrl, dto.CreatedBy);
        await _unitOfWork.Group.AddAsync(createdGroup);
        await _unitOfWork.SaveChangesAsync();
        return Ok();
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
  
}