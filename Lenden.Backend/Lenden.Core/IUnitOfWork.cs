using Lenden.Core.GroupFeatures;

namespace Lenden.Core;

public interface IUnitOfWork
{
    IGroupRepository Group { get; }
    Task SaveChangesAsync();
}