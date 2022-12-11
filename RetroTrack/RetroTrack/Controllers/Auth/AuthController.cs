﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Data;
using RetroTrack.Domain.Dtos;
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
            var loginData = AuthData.ValidateUserLogin(dto.Username.ToLower(), dto.Password);

            if (!loginData.Successful)
            {
                return Unauthorized();
            }

            return Ok(loginData);
        }

        [HttpPost("RegisterNewUser")]
        public async Task<RegisterUserDto> RegisterNewUserAsync([FromBody] RegisterNewUserRequestDto dto)
        {
            return await AuthData.RegisterUser(dto.Username.ToLower(), dto.Password, dto.ApiKey);
        }

        [HttpDelete("DeleteUserSession")]
        public ActionResult DeleteUserSession()
        {
            if (Request.Headers["Authorization"].Count == 0)
            {
                return BadRequest();
            }

            UserData.DeleteUserSession(Request.Headers["Authorization"]);
            return Ok();
        }
    }
}
