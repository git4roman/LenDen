namespace Lenden.Core.BalanceFeatures;

public interface IBalanceRepository: IRepository<BalanceEntity>
{
    Task<BalanceEntity?> GetBalanceByGroupAndUsersIdAsync(int groupId,int userId);
}