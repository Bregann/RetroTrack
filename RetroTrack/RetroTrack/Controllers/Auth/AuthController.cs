using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Api.Dtos.Request.Auth;
using RetroTrack.Api.Dtos.Response;
using RetroTrack.Domain.Public.Authenication;

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
    }
}
