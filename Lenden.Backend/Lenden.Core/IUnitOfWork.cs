using Lenden.Core.BalanceFeatures;
using Lenden.Core.ExpenseFeatures;
using Lenden.Core.GroupFeatures;
using Lenden.Core.SettlementFeatures;
using Lenden.Core.TransactionFeatures;
using Lenden.Core.UserFeatures;
using Lenden.Core.UserGroupFeatures;

namespace Lenden.Core;

public interface IUnitOfWork
{
    IGroupRepository Group { get; }
    IUserRepository User { get; }
    ITransactionRepository Transaction { get; }
    IBalanceRepository Balance { get; }
    IUserGroupRepository UserGroup { get; }
    IExpenseRepository Expense { get; }
    
    ISettlementRepository Settlement { get; }
    
    Task SaveChangesAsync();
}