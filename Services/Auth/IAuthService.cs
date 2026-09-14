using InventoryApi.DTOs.Auth;

namespace InventoryApi.Services.Auth;

public interface IAuthService
{
    Task<AuthResponseDto> SignupAsync(SignupRequestDto dto);

    Task<LoginResponseDto> LoginAsync(LoginRequestDto dto);
}