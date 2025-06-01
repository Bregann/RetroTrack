using RetroTrack.Domain.OldCode;

namespace RetroTrack.Api
{
    public class ApiAuthorisationMiddleware
    {
        private readonly RequestDelegate _next;

        public ApiAuthorisationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Get the API key from the request headers or query string
            var apiKeyFromRequest = context.Request.Headers["ApiSecret"].ToString();

            if (string.IsNullOrEmpty(apiKeyFromRequest))
            {
                // If API key is missing, respond with "Forbidden"
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return;
            }

            // Check if the API key matches
            if (!apiKeyFromRequest.Equals(AppConfig.ApiSecret, StringComparison.OrdinalIgnoreCase))
            {
                // If API key doesn't match, respond with "Unauthorized"
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }

            // If API key is valid, proceed to the next middleware
            await _next(context);
        }
    }

    public static class AuthorizationMiddlewareExtensions
    {
        public static IApplicationBuilder UseApiAuthorizationMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ApiAuthorisationMiddleware>();
        }
    }
}
