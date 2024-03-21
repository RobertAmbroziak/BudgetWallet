namespace BusinessLogic.Abstractions
{
    public abstract class MapperServiceBase<TSource, TDestination> : IMapperService<TSource, TDestination>
    {
        public abstract TDestination Map(TSource source);

        public virtual IEnumerable<TDestination> Map(IEnumerable<TSource> sources)
        {
            return sources.Select(Map);
        }
    }
}
