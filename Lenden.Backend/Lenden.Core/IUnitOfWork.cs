using Lenden.Core.BalanceFeatures;
using Lenden.Core.GroupFeatures;
using Lenden.Core.TransactionFeatures;
using Lenden.Core.UserFeatures;

namespace Lenden.Core;

public interface IUnitOfWork
{
    IGroupRepository Group { get; }
    IUserRepository User { get; }
    ITransactionRepository Transaction { get; }
    IBalanceRepository Balance { get; }
    Task SaveChangesAsync();
}