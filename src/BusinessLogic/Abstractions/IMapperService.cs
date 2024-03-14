namespace BusinessLogic.Abstractions
{
    public interface IMapperService<TSource, TDestination>
    {
        TDestination Map(TSource source);
        public IEnumerable<TDestination> Map(IEnumerable<TSource> sources)
        {
            return sources.Select(Map);
        }
    }
}
