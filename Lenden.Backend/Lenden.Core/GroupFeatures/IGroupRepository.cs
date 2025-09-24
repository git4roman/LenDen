using System.Text.RegularExpressions;

namespace Lenden.Core.GroupFeatures;

public interface IGroupRepository: IRepository<GroupEntity>
{
    Task<IEnumerable<GroupEntity>?> GetGroupsByUserId(int id);
}