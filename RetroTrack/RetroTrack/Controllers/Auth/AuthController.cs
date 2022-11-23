using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data.Public.Auth;
using RetroTrack.Domain.Dtos.Public;
using RetroTrack.Dtos.Auth;

namespace RetroTrack.Api.Controllers.Authenication
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("LoginUser")]
        public ActionResult<LoginUserDto> LoginUser([FromBody] LoginUserRequestDto dto)
        {
            var loginData = Auth.ValidateUserLogin(dto.Username.ToLower(), dto.Password);

            if (!loginData.Successful)
            {
                return Unauthorized();
            }

            return Ok(loginData);
        }

        [HttpPost("RegisterNewUser")]
        public async Task<RegisterUserDto> RegisterNewUserAsync([FromBody] RegisterNewUserRequestDto dto)
        {
            return await Auth.RegisterUser(dto.Username.ToLower(), dto.Password, dto.ApiKey);
        }
    }
}
