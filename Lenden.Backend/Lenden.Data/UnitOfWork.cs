﻿using System.Text.RegularExpressions;
using Lenden.Core;
using Lenden.Core.BalanceFeatures;
using Lenden.Core.GroupFeatures;
using Lenden.Core.TransactionFeatures;
using Lenden.Core.UserFeatures;
using Lenden.Data.DbContexts;
using Lenden.Data.Repositories;

namespace Lenden.Data;

public class UnitOfWork: IUnitOfWork
{
    protected AppDbContext _context;
    public IGroupRepository Group { get; private set; }
    public IUserRepository User { get; private set; }
    public ITransactionRepository Transaction { get; private set; }
    
    public IBalanceRepository Balance { get; private set; }
    public async Task SaveChangesAsync()
    {
        await  _context.SaveChangesAsync();
    }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Group = new GroupRepository(_context);
        User = new UserRepository(_context);
        Transaction = new TransactionRepository(_context);
        Balance = new BalanceRepository(_context);
    }
    
}