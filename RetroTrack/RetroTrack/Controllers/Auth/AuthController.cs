using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Api.Dtos.Request.Auth;
using RetroTrack.Api.Dtos.Response.Auth;
using RetroTrack.Domain.Data.Public.Auth;

namespace RetroTrack.Api.Controllers.Authenication
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("LoginUser")]
        public ActionResult<LoginUserResponseDto> LoginUser([FromBody] LoginUserRequestDto dto)
        {
            var loginData = Auth.ValidateUserLogin(dto.Username, dto.Password);

            if (!loginData.Successful)
            {
                return Unauthorized();
            }

            return Ok(new LoginUserResponseDto 
            { 
                SessionId = loginData.SessionId,
                Username = dto.Username
            });
        }

        [HttpPost("RegisterNewUser")]
        public async Task<RegisterNewUserResponseDto> RegisterNewUserAsync([FromBody] RegisterNewUserRequestDto dto)
        {
            var registerData = await Auth.RegisterUser(dto.Username, dto.Password, dto.ApiKey);

            if (registerData.Reason == null)
            {
                return new RegisterNewUserResponseDto
                {
                    Success = registerData.Successful
                };
            }

            return new RegisterNewUserResponseDto
            {
                Success = registerData.Successful,
                Error = registerData.Reason
            };
        }
    }
}
