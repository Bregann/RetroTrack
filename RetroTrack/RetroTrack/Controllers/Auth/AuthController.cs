using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Api.Dtos.Request.Auth;
using RetroTrack.Api.Dtos.Response;

namespace RetroTrack.Api.Controllers.Authenication
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("LoginUser")]
        public ActionResult<LoginUserResponseDto> LoginUser([FromBody] LoginUserRequestDto dto)
        {
            return new LoginUserResponseDto { SessionId = "lolol123", Username = "guinea"};
        }
    }
}
