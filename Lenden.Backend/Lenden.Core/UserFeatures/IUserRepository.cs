namespace Lenden.Core.UserFeatures;

public interface IUserRepository: IRepository<UserEntity>
{
    Task<UserEntity?> GetUserByEmailAsync(string email);
    Task<UserEntity?> GetUserByUidAsync(string uid);
}