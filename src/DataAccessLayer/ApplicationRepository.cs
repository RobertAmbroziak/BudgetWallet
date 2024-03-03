using DataAccessLayer.Generic;

namespace DataAccessLayer
{
    public class ApplicationRepository : Repository, IApplicationRepository
    {
        public ApplicationRepository(IApplicationDbContext context) : base(context)
        {
        }
    }
}
