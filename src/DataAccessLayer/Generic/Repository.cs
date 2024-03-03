using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Model.Tables.Abstractions;
using System.Linq.Expressions;
using System.Reflection;

namespace DataAccessLayer.Generic
{
    public class Repository : IRepository
    {
        protected readonly IApplicationDbContext _context;

        public Repository(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task DeleteAsync<TEntity>(int id) where TEntity : BaseDto
        {
            if (id <= 0)
                throw new ArgumentOutOfRangeException(nameof(id));

            var _entities = _context.Set<TEntity>();
            var entity = await _entities.SingleOrDefaultAsync(s => s.Id == id);
            _entities.Remove(entity);
        }

        public async Task<IEnumerable<TEntity>> FilterAsync<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseDto
        {
            return await _context.Set<TEntity>().Where(predicate).ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> FilterAsyncByConditionsWithLimit<TEntity>(Dictionary<string, object> conditions, int? limit) where TEntity : BaseDto
        {
            var predicate = conditions.Any() ? BuildDynamicCondition<TEntity>(conditions) : x => true;

            if (limit != null)
            {
                return await _context.Set<TEntity>().Where(predicate).Take((int)limit).ToListAsync();
            }
            else
            {
                return await _context.Set<TEntity>().Where(predicate).ToListAsync();
            }
        }

        public async Task<IEnumerable<TEntity>> GetAllWithSkipAndLimitAsync<TEntity>(int skip, int limit) where TEntity : BaseDto
        {
            return await _context.Set<TEntity>().Skip(skip).Take(limit).ToListAsync();
        }

        public Task<int> TotalCountAsync<TEntity>() where TEntity : BaseDto
        {
            return _context.Set<TEntity>().CountAsync();
        }

        public Task<int> TotalCountWithFilterAsync<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseDto
        {
            return _context.Set<TEntity>().Where(predicate).CountAsync();
        }

        public Task<TEntity> FirstOrDefault<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseDto
        {
            return _context.Set<TEntity>().FirstOrDefaultAsync(predicate);
        }

        public Task<bool> Any<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseDto
        {
            return _context.Set<TEntity>().AnyAsync(predicate);
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync<TEntity>() where TEntity : BaseDto
        {
            var _entities = _context.Set<TEntity>();
            return await _entities.ToListAsync<TEntity>();
        }

        public async Task<TEntity> GetByIdAsync<TEntity>(int id) where TEntity : BaseDto
        {
            var _entities = _context.Set<TEntity>();
            return await _entities.SingleOrDefaultAsync(s => s.Id == id);
        }

        public async Task<EntityEntry<TEntity>> InsertAsync<TEntity>(TEntity entity) where TEntity : BaseDto
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));
            var _entities = _context.Set<TEntity>();
            var result = await _entities.AddAsync(entity);

            return result;
        }

        public Task SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }

        protected Expression<Func<TEntity, bool>> BuildDynamicCondition<TEntity>(Dictionary<string, object> conditions) where TEntity : BaseDto
        {
            ParameterExpression param = Expression.Parameter(typeof(TEntity), "x");
            Expression condition = null;

            foreach (var kvp in conditions)
            {
                PropertyInfo property = typeof(TEntity).GetProperty(kvp.Key);
                if (property == null)
                {
                    throw new ArgumentException($"Pole {kvp.Key} nie istnieje w klasie {typeof(TEntity).Name}.");
                }

                MemberExpression propertyAccess = Expression.Property(param, property);
                ConstantExpression value = Expression.Constant(kvp.Value);
                BinaryExpression binaryExpression = Expression.Equal(propertyAccess, value);

                if (condition == null)
                {
                    condition = binaryExpression;
                }
                else
                {
                    condition = Expression.AndAlso(condition, binaryExpression);
                }
            }

            return Expression.Lambda<Func<TEntity, bool>>(condition, param);
        }
    }
}
