using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.DTOs.Controllers.Auth.Requests;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController(IAuthControllerDataService authDataService) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> LoginUser([FromBody] LoginUserRequest request)
        {
            try
            {
                var loginData = await authDataService.LoginUser(request.Username.ToLower().Trim(), request.Password);

                Response.Cookies.Append("accessToken", loginData.AccessToken, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddHours(1)
                });

                Response.Cookies.Append("refreshToken", loginData.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddDays(30)
                });

                return Ok();
            }
            catch (Exception ex) when (ex is UnauthorizedAccessException || ex is KeyNotFoundException)
            {
                return Unauthorized("Invalid username/password");
            }
        }

        [HttpPost]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
            {
                Response.Cookies.Delete("accessToken");
                Response.Cookies.Delete("refreshToken");
                return Unauthorized("No refresh token provided");
            }

            try
            {
                var newAccessToken = await authDataService.RefreshToken(refreshToken);
                Response.Cookies.Append("accessToken", newAccessToken, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddHours(1)
                });
                return Ok();
            }
            catch (Exception ex) when (ex is UnauthorizedAccessException || ex is KeyNotFoundException)
            {
                Response.Cookies.Delete("accessToken");
                Response.Cookies.Delete("refreshToken");
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> RegisterNewUser([FromBody] RegisterNewUserRequest request)
        {
            try
            {
                await authDataService.RegisterUser(request.Username.ToLower().Trim(), request.Password, request.ApiKey.Trim());
                return Ok();
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> ResetUserPassword([FromBody] ResetUserPasswordRequest request)
        {
            try
            {
                await authDataService.ResetUserPassword(request.Username.ToLower().Trim(), request.Password, request.ApiKey.Trim());
                return Ok();
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> DeleteUserSession([FromBody] DeleteUserSessionRequest refreshToken)
        {
            await authDataService.DeleteUserSession(refreshToken.RefreshToken);
            return Ok(true);
        }
    }
}
