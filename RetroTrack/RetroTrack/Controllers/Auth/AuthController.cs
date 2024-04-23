using Microsoft.AspNetCore.Mvc;
using RetroTrack.Api.Dtos.Auth;
using RetroTrack.Domain.Data;
using RetroTrack.Domain.Dtos;

namespace RetroTrack.Api.Api.Controllers.Authenication
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost]
        public ActionResult<LoginUserDto> LoginUser([FromBody] LoginUserRequestDto dto)
        {
            var loginData = AuthData.ValidateUserLogin(dto.Username.ToLower(), dto.Password);

            if (!loginData.Successful)
            {
                return Unauthorized(false);
            }

            return Ok(loginData);
        }

        [HttpPost]
        public async Task<RegisterUserDto> RegisterNewUserAsync([FromBody] RegisterNewUserRequestDto dto)
        {
            return await AuthData.RegisterUser(dto.Username.ToLower().Trim(), dto.Password, dto.ApiKey.Trim());
        }

        [HttpPost]
        public async Task<ResetUserPasswordDto> ResetUserPassword([FromBody] ResetUserPasswordRequestDto dto)
        {
            return await AuthData.ResetUserPassword(dto.Username.ToLower().Trim(), dto.Password, dto.ApiKey.Trim());
        }

        [HttpPost]
        public async Task<bool> ValidateSessionStatus()
        {
            return await AuthData.ValidateSessionStatus("");
        }

        [HttpDelete]
        public ActionResult DeleteUserSession()
        {
            if (string.IsNullOrEmpty(Request.Headers.Authorization))
            {
                return BadRequest();
            }

            UserData.DeleteUserSession(Request.Headers.Authorization!);
            return Ok(true);
        }
    }
}