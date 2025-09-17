namespace Lenden.Core;

public interface IRepository<T> where T : class
{
    Task AddAsync(T entity);
    Task RemoveAsync(T entity);
    Task Update(T entity);
    Task <T?> GetByIdAsync(int id);
    Task <IEnumerable<T>> GetAllAsync();
}