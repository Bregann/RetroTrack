using Microsoft.AspNetCore.Mvc;
using RetroTrack.Api.Dtos.Auth;
using RetroTrack.Domain.DTOs.Controllers.Auth;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Api.Controllers.Auth
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController(IAuthControllerDataService authDataService) : ControllerBase
    {
        [HttpPost]
        public ActionResult<LoginUserDto> LoginUser([FromBody] LoginUserRequestDto dto)
        {
            var loginData = authDataService.ValidateUserLogin(dto.Username.ToLower(), dto.Password);

            if (!loginData.Successful)
            {
                return Unauthorized(false);
            }

            return Ok(loginData);
        }

        [HttpPost]
        public async Task<RegisterUserDto> RegisterNewUser([FromBody] RegisterNewUserRequestDto dto)
        {
            return await authDataService.RegisterUser(dto.Username.ToLower().Trim(), dto.Password, dto.ApiKey.Trim());
        }

        [HttpPost]
        public async Task<ResetUserPasswordDto> ResetUserPassword([FromBody] ResetUserPasswordRequestDto dto)
        {
            return await authDataService.ResetUserPassword(dto.Username.ToLower().Trim(), dto.Password, dto.ApiKey.Trim());
        }

        [HttpGet]
        public async Task<bool> ValidateSessionStatus()
        {
            if (string.IsNullOrEmpty(Request.Headers.Authorization))
            {
                return false;
            }
            else
            {
                var data = await authDataService.ValidateSessionStatus(Request.Headers.Authorization!);
                return data;
            }
        }

        [HttpDelete]
        public ActionResult DeleteUserSession()
        {
            if (string.IsNullOrEmpty(Request.Headers.Authorization))
            {
                return BadRequest();
            }

            authDataService.DeleteUserSession(Request.Headers.Authorization!);
            return Ok(true);
        }
    }
}