namespace BusinessLogic.Abstractions
{
    public interface IMapperService<TSource, TDestination>
    {
        TDestination Map(TSource source);
        IEnumerable<TDestination> Map(IEnumerable<TSource> sources);
    }
}
