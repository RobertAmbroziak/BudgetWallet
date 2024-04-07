using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Model.Tables.Abstractions;
using System.Linq.Expressions;
using System.Reflection;
using System.Text.RegularExpressions;

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

        # region Hiper Enigmatic Dynamic Condition Builder
        /// <summary>
        /// Builds a dynamic LINQ expression based on the provided conditions. This method allows for creating complex filtering expressions at runtime, supporting both simple and nested property comparisons within TEntity.
        /// </summary>
        /// <param name="conditions">A dictionary where keys are the property names (with optional comparison operators and nested properties indicated by a dot notation) and values are the values to compare against.</param>
        /// <typeparam name="TEntity">The entity type for which the condition is being built. Must inherit from BaseDto.</typeparam>
        /// <returns>An Expression representing the dynamically built condition, suitable for use with LINQ queries.</returns>
        /// <remarks>
        /// This method supports handling nullable properties and comparison operations such as equal, not equal, greater than, and less than. 
        /// Example usage: conditions.Add("Property.SubProperty >= @0", value); to add a condition that SubProperty of Property must be greater or equal to the specified value.
        /// </remarks>
        protected Expression<Func<TEntity, bool>> BuildDynamicCondition<TEntity>(Dictionary<string, object> conditions) where TEntity : BaseDto
        {
            ParameterExpression param = Expression.Parameter(typeof(TEntity), "x");
            Expression condition = null;

            foreach (var kvp in conditions)
            {
                var (propertyName, operation) = ParseConditionKey(kvp.Key);
                Expression binaryExpression = propertyName.Contains(".")
                    ? HandleNestedPropertyComparison<TEntity>(propertyName, operation, kvp.Value, param)
                    : HandleSimplePropertyComparison<TEntity>(propertyName, operation, kvp.Value, param);

                condition = condition == null ? binaryExpression : Expression.AndAlso(condition, binaryExpression);
            }

            return Expression.Lambda<Func<TEntity, bool>>(condition ?? Expression.Constant(true), param);
        }

        private (string propertyName, string operation) ParseConditionKey(string key)
        {
            var operationPatterns = new Dictionary<string, string>
            {
                { @"\s*>=\s*@\d+", ">=" },
                { @"\s*<=\s*@\d+", "<=" },
                { @"\s*>\s*@\d+", ">" },
                { @"\s*<\s*@\d+", "<" }
            };

            string operation = "=";
            string propertyName = key;

            foreach (var pattern in operationPatterns)
            {
                var regex = new Regex(pattern.Key);
                if (regex.IsMatch(key))
                {
                    operation = pattern.Value;
                    propertyName = regex.Replace(key, "").Trim();
                    break; 
                }
            }

            return (propertyName, operation);
        }

        private Expression HandleSimplePropertyComparison<TEntity>(string propertyName, string operation, object value, ParameterExpression param)
        {
            PropertyInfo propertyInfo = GetPropertyInfo(typeof(TEntity), propertyName);
            MemberExpression propertyAccess = Expression.Property(param, propertyInfo);
            return CreateBinaryExpression(propertyAccess, value, operation, propertyInfo.PropertyType);
        }

        private Expression HandleNestedPropertyComparison<TEntity>(string propertyName, string operation, object value, ParameterExpression param)
        {
            string[] parts = propertyName.Split('.');
            PropertyInfo propertyInfo = GetPropertyInfo(typeof(TEntity), parts[0]);
            PropertyInfo nestedPropertyInfo = GetPropertyInfo(propertyInfo.PropertyType, parts[1]);

            Expression propertyAccess = Expression.Property(param, propertyInfo);
            MemberExpression nestedPropertyAccess = Expression.Property(propertyAccess, nestedPropertyInfo);

            return CreateBinaryExpression(nestedPropertyAccess, value, operation, nestedPropertyInfo.PropertyType);
        }

        private PropertyInfo GetPropertyInfo(Type entityType, string propertyName)
        {
            PropertyInfo property = entityType.GetProperty(propertyName);
            if (property == null)
                throw new ArgumentException($"Property {propertyName} does not exist in {entityType}.");
            return property;
        }

        private Expression CreateBinaryExpression(Expression propertyAccess, object value, string operation, Type propertyType)
        {
            ConstantExpression constant = CreateConstantExpression(value, propertyType);
            return operation switch
            {
                "=" => Expression.Equal(propertyAccess, constant),
                ">=" => Expression.GreaterThanOrEqual(propertyAccess, constant),
                "<=" => Expression.LessThanOrEqual(propertyAccess, constant),
                ">" => Expression.GreaterThan(propertyAccess, constant),
                "<" => Expression.LessThan(propertyAccess, constant),
                _ => throw new NotSupportedException($"Operation '{operation}' is not supported."),
            };
        }

        private ConstantExpression CreateConstantExpression(object value, Type propertyType)
        {
            if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                if (value == null)
                {
                    return Expression.Constant(null, propertyType);
                }
                Type nullableType = Nullable.GetUnderlyingType(propertyType);
                return Expression.Constant(Convert.ChangeType(value, nullableType), propertyType);
            }
            else
            {
                return Expression.Constant(value, value.GetType());
            }
        }

        #endregion
    }
}
