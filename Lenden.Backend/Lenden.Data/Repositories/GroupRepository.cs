﻿using System.Text.RegularExpressions;
using Lenden.Core.GroupFeatures;
using Lenden.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Data;

public class GroupRepository: Repository<GroupEntity>, IGroupRepository
{
    private readonly AppDbContext _context;
    public GroupRepository(AppDbContext context): base(context)
    {
        _context = context;
    }
}