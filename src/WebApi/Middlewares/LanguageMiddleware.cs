using System.Globalization;

namespace WebApi.Middlewares
{
    public class LanguageMiddleware
    {
        private readonly RequestDelegate _next;

        public LanguageMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var langHeader = context.Request.Headers["Accept-Language"].ToString();
            if (!string.IsNullOrEmpty(langHeader))
            {
                var preferredLanguages = langHeader.Split(',').Select(x => x.Split(';')[0].Trim()).ToList();

                foreach (var preferredLanguage in preferredLanguages)
                {
                    try
                    {
                        var culture = CultureInfo.GetCultureInfo(preferredLanguage);
                        CultureInfo.CurrentCulture = culture;
                        CultureInfo.CurrentUICulture = culture;
                        break;
                    }
                    catch (CultureNotFoundException)
                    {
                        continue;
                    }
                }
            }

            await _next(context);
        }
    }
}
