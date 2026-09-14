import { apiClient } from '../../../api/client.ts';
import { API_ENDPOINTS } from '../../../api/endpoints.ts';
import type {
  LoginRequestDto,
  LoginResponseDto,
  SignupRequestDto,
  AuthResponseDto,
} from '../../../types/auth.types.ts';

export const authApi = {
  /**
   * Authenticates user and returns JWT token
   */
  login: async (credentials: LoginRequestDto): Promise<LoginResponseDto> => {
    const response = await apiClient.post<LoginResponseDto>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  /**
   * Registers a new user account
   */
  signup: async (data: SignupRequestDto): Promise<AuthResponseDto> => {
    const response = await apiClient.post<AuthResponseDto>(
      API_ENDPOINTS.AUTH.SIGNUP,
      data
    );
    return response.data;
  },
};
