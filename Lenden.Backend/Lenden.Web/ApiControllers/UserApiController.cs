using Lenden.Core;
using Lenden.Core.UserFeatures;
using Lenden.Core.Utilities;
using Lenden.Data.DbContexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Web.ApiControllers;

[ApiController]
[Route("api/[controller]")]
public class UserApiController: ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly CurrentUserHelper _currentUserHelper;
    private readonly AppDbContext _context;
    public UserApiController(IUnitOfWork unitOfWork,CurrentUserHelper  currentUserHelper, AppDbContext context)
    {
        _unitOfWork = unitOfWork;
        _currentUserHelper = currentUserHelper;
        _context = context;
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

   

    [Authorize]
    [HttpGet("myfriends")]
    public async Task<IActionResult> GetMyFriends()
    {
        var userId = _currentUserHelper.GetUserId();
        if (!userId.HasValue)
        {
            return Unauthorized("User ID not found in token.");
        }
        var existingUser = await _unitOfWork.User.GetByIdAsync(userId.Value);
        if(existingUser == null) return NotFound();
        var associatedGroupsId = await _context.UserGroups.Where(u => u.UserId == userId.Value).Select(u => u.GroupId)
            .ToListAsync();
        
        var allGroupMembers = new List<int>();
        
        foreach (var groupId in associatedGroupsId)
        {
            var groupMembersId = await _context.UserGroups
                .Where(u => u.GroupId == groupId && u.UserId != userId.Value)
                .Select(u => u.UserId)
                .ToListAsync();
            allGroupMembers.AddRange(groupMembersId);
        }
        var uniqueMembersId = allGroupMembers.ToHashSet().ToList();
        List<object> members = new List<object>();
        foreach (var memberId in uniqueMembersId)
        {
            var user = await _unitOfWork.User.GetByIdAsync(memberId);
            if (user == null) return NotFound();
            members.Add(user);
        }
        return Ok(members);
    }
    
    [Authorize]
    [HttpPost("addPhoneNumber")]
    public async Task<IActionResult> AddPhoneNumber([FromQuery] string phoneHashed)
    {
        var userId = _currentUserHelper.GetUserId();
        if(!userId.HasValue) return Unauthorized("User ID not found in token.");
        var  existingUser = await _unitOfWork.User.GetByIdAsync(userId.Value);
        if (existingUser == null) return NotFound();
        existingUser.PhoneHash = phoneHashed;
        await _unitOfWork.SaveChangesAsync();
        return Ok();
    }
    
    [Authorize]
    [HttpPost("check-contacts")]
    public async Task<IActionResult> CheckContacts([FromBody] List<string> hashedContacts)
    {
        var userId =  _currentUserHelper.GetUserId();
        if (userId == null) return Unauthorized("UnAuthorised user");
        var currentUserId = userId.Value;
        var existingUsers = await _context.Users
            .Where(u => u.PhoneHash != null && hashedContacts.Contains(u.PhoneHash))
            .Select(u => new { u.Id, u.FullName, u.PhoneHash })
            .ToListAsync();

        // var foundHashes = existingUsers.Select(u => u.PhoneHash).ToHashSet();
        // var notFound = hashedContacts
        //     .Where(h => !foundHashes.Contains(h))
        //     .Select(h => new { phoneHash = h, inviteLink = $"https://yourapp.com/invite?ref={currentUserId}" });

        return Ok(new { existingUsers });
    }

    
    
}