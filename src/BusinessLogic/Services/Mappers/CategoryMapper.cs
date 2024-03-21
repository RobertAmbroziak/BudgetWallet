using BusinessLogic.Abstractions;
using Model.Application;
using Model.Tables;

namespace BusinessLogic.Services.Mappers
{
    public class CategoryMapper : MapperServiceBase<CategoryDto, Category>
    {
        public override Category Map(CategoryDto source)
        {
            return new Category
            {
                Id = source.Id,
                Name = source.Name,
                Description = source.Description,
                IsActive = source.IsActive
            };
        }
    }
}
