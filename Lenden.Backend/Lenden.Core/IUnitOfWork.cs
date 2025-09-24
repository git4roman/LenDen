using Lenden.Core.BalanceFeatures;
using Lenden.Core.GroupFeatures;
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
    Task SaveChangesAsync();
}