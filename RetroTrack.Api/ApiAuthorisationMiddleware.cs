namespace RetroTrack.Api
{
    public class ApiAuthorisationMiddleware(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            // Get the API key from the request headers or query string
            var apiKeyFromRequest = context.Request.Headers["X-ApiSecretKey"].ToString();

            if (string.IsNullOrEmpty(apiKeyFromRequest))
            {
                // If API key is missing, respond with "Forbidden"
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return;
            }

            // Check if the API key matches
            if (!apiKeyFromRequest.Equals(Environment.GetEnvironmentVariable("ApiSecret")))
            {
                // If API key doesn't match, respond with "Unauthorized"
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }

            // If API key is valid, proceed to the next middleware
            await next(context);
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
