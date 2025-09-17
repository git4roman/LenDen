using Lenden.Core;
using Lenden.Core.GroupFeatures;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.ApiControllers;

[ApiController]
[Route("api/[controller]")] // uses controller name = group
public class GroupApiController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public GroupApiController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return Ok("Group API working");
    }

    [HttpPost]
    public async Task<IActionResult> CreateGroup([FromBody] string name)
    {
        var createdGroup = new GroupEntity(name, "htpppsssssdfsd:////sdjfhkjsdkjfkshkdjfh");
        await _unitOfWork.Group.AddAsync(createdGroup);
        await _unitOfWork.SaveChangesAsync();
        return Ok();
    }
    [HttpPut("{id}/update")]
    public async Task<IActionResult> CreateGroup(int id,[FromBody] string name)
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