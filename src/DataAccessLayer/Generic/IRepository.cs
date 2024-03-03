using Microsoft.EntityFrameworkCore.ChangeTracking;
using Model.Tables.Abstractions;
using System.Linq.Expressions;

namespace DataAccessLayer.Generic
{
    public interface IRepository
    {
        Task DeleteAsync<TEntity>(int id) where TEntity : BaseDto;

        Task<IEnumerable<TEntity>> FilterAsync<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseDto;

        Task<IEnumerable<TEntity>> FilterAsyncByConditionsWithLimit<TEntity>(Dictionary<string, object> conditions, int? limit) where TEntity : BaseDto;

        Task<IEnumerable<TEntity>> GetAllWithSkipAndLimitAsync<TEntity>(int skip, int limit) where TEntity : BaseDto;

        Task<int> TotalCountAsync<TEntity>() where TEntity : BaseDto;

        Task<int> TotalCountWithFilterAsync<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseDto;

        Task<TEntity> FirstOrDefault<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseDto;

        Task<bool> Any<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseDto;

        Task<IEnumerable<TEntity>> GetAllAsync<TEntity>() where TEntity : BaseDto;

        Task<TEntity> GetByIdAsync<TEntity>(int id) where TEntity : BaseDto;

        Task<EntityEntry<TEntity>> InsertAsync<TEntity>(TEntity entity) where TEntity : BaseDto;

        Task SaveChangesAsync();
    }
}
