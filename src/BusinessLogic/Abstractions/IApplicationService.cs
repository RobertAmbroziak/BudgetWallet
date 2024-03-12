﻿using Model.Application;

namespace BusinessLogic.Abstractions
{
    public interface IApplicationService
    {
        Task<SplitsResponse> GetSplitsResponse(SplitsRequest splitsRequest);
    }
}