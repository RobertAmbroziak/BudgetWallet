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

        /* TODO:  WTF ??? It works for now in my cases, but it's quite messy */
        protected Expression<Func<TEntity, bool>> BuildDynamicCondition<TEntity>(Dictionary<string, object> conditions) where TEntity : BaseDto
        {
            ParameterExpression param = Expression.Parameter(typeof(TEntity), "x");
            Expression condition = null;

            foreach (var kvp in conditions)
            {
                if (kvp.Key.Contains("."))
                {
                    string[] parts = kvp.Key.Split('.');
                    string nestedPropertyName = parts[0];
                    string nestedPropertyNestedName = parts[1];

                    if (kvp.Key.EndsWith(">= @0"))
                    {
                        PropertyInfo nestedProperty = typeof(TEntity).GetProperty(nestedPropertyName);
                        if (nestedProperty == null)
                        {
                            throw new ArgumentException($"Property {nestedPropertyName} does not exist in the class {typeof(TEntity)}.");
                        }
                        PropertyInfo nestedPropertyNested = nestedProperty.PropertyType.GetProperty(nestedPropertyNestedName.Replace(" >= @0", string.Empty));
                        if (nestedPropertyNested == null)
                        {
                            throw new ArgumentException($"Property {nestedPropertyNested} does not exist in the class {nestedProperty}.");
                        }

                        Expression nestedPropertyAccess = Expression.Property(param, nestedProperty);
                        Expression nestedPropertyNestedAccess = Expression.Property(nestedPropertyAccess, nestedPropertyNested);

                        ConstantExpression value = Expression.Constant(kvp.Value);

                        BinaryExpression binaryExpression = Expression.GreaterThanOrEqual(nestedPropertyNestedAccess, value);
                        condition = condition == null ? binaryExpression : Expression.AndAlso(condition, binaryExpression);
                    }
                    else if (kvp.Key.EndsWith("< @1"))
                    {
                        PropertyInfo nestedProperty = typeof(TEntity).GetProperty(nestedPropertyName);
                        if (nestedProperty == null)
                        {
                            throw new ArgumentException($"Property {nestedPropertyName} does not exist in the class {typeof(TEntity)}.");
                        }
                        PropertyInfo nestedPropertyNested = nestedProperty.PropertyType.GetProperty(nestedPropertyNestedName.Replace(" < @1", string.Empty));
                        if (nestedPropertyNested == null)
                        {
                            throw new ArgumentException($"Property {nestedPropertyNested} does not exist in the class {nestedProperty}.");
                        }

                        Expression nestedPropertyAccess = Expression.Property(param, nestedProperty);
                        Expression nestedPropertyNestedAccess = Expression.Property(nestedPropertyAccess, nestedPropertyNested);

                        ConstantExpression value = Expression.Constant(kvp.Value);

                        BinaryExpression binaryExpression = Expression.LessThan(nestedPropertyNestedAccess, value);
                        condition = condition == null ? binaryExpression : Expression.AndAlso(condition, binaryExpression);
                    }
                    else
                    {
                        PropertyInfo nestedProperty = typeof(TEntity).GetProperty(nestedPropertyName);
                        if (nestedProperty == null)
                        {
                            throw new ArgumentException($"Property {nestedPropertyName} does not exist in the class {typeof(TEntity)}.");
                        }
                        PropertyInfo nestedPropertyNested = nestedProperty.PropertyType.GetProperty(nestedPropertyNestedName);
                        if (nestedPropertyNested == null)
                        {
                            throw new ArgumentException($"Property {nestedPropertyNested} does not exist in the class {nestedProperty}.");
                        }

                        Expression nestedPropertyAccess = Expression.Property(param, nestedProperty);
                        Expression nestedPropertyNestedAccess = Expression.Property(nestedPropertyAccess, nestedPropertyNested);

                        ConstantExpression value = Expression.Constant(kvp.Value);

                        if (nestedPropertyNested.PropertyType.IsGenericType && nestedPropertyNested.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                        {
                            Type underlyingType = Nullable.GetUnderlyingType(nestedPropertyNested.PropertyType);

                            if (kvp.Value != null && kvp.Value.GetType() == underlyingType)
                            {
                                value = Expression.Constant(kvp.Value, nestedPropertyNested.PropertyType);
                            }
                        }

                        BinaryExpression binaryExpression = Expression.Equal(nestedPropertyNestedAccess, value);

                        if (condition == null)
                        {
                            condition = binaryExpression;
                        }
                        else
                        {
                            condition = Expression.AndAlso(condition, binaryExpression);
                        }
                    }
                }
                else
                {
                    PropertyInfo property = typeof(TEntity).GetProperty(kvp.Key);
                    if (property == null)
                    {
                        throw new ArgumentException($"Property {kvp.Key} does not exist in the class {typeof(TEntity)}.");
                    }

                    MemberExpression propertyAccess = Expression.Property(param, property);
                    ConstantExpression value = Expression.Constant(kvp.Value);

                    if (property.PropertyType.IsGenericType && property.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                    {
                        Type underlyingType = Nullable.GetUnderlyingType(property.PropertyType);

                        if (kvp.Value != null && kvp.Value.GetType() == underlyingType)
                        {
                            value = Expression.Constant(kvp.Value, property.PropertyType);
                        }
                        else if (kvp.Value == null)
                        {
                            value = Expression.Constant(null, property.PropertyType);
                        }
                    }

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
            }

            return Expression.Lambda<Func<TEntity, bool>>(condition, param);
        }
    }
}
