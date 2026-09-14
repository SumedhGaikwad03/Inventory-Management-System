using InventoryApi.DTOs.Auth;
using InventoryApi.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace InventoryApi.Controllers;

[ApiController]
[Route("api/[controller]")] // this is the structure of the query for the string request
// the [controller] becomes auth as the keyword defined below
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService; // we created a variable that
    // implements the interface and holds it in the variable for this
    //class

    // this is a constructor of auth controller
    // this basically means that to create the authcontroller we need
    // something that implements IAuthService , here is where we implement or take
    // help of program.cs to inject the dependency
    // in this part the controller depends on the interface
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // POST: /api/auth/signup
    [HttpPost("signup")]

    // the line below simply says like "This is an asynchronous API operation that
    // will return an HTTP result containing an AuthResponseDto"
    public async Task<ActionResult<AuthResponseDto>> Signup(
        SignupRequestDto dto)
    {
        var user = await _authService.SignupAsync(dto);// we call the
        // signup service through dependency injection

        return Ok(user);
    }

    // POST: /api/auth/login
[HttpPost("login")]
public async Task<ActionResult<LoginResponseDto>> Login(
    LoginRequestDto dto)
{
    var response = await _authService.LoginAsync(dto);

    return Ok(response);
}
}
