/**
 * Matches backend LoginRequestDto
 */
export interface LoginRequestDto {
  username: string;
  password: string;
}

/**
 * Matches backend SignupRequestDto
 */
export interface SignupRequestDto {
  username: string;
  email: string;
  password: string;
}

/**
 * Matches backend LoginResponseDto
 */
export interface LoginResponseDto {
  token: string;
}

/**
 * Matches backend AuthResponseDto
 */
export interface AuthResponseDto {
  id: number;
  username: string;
  email: string;
  createdDate: string;
}

/**
 * Authenticated user profile decoded from JWT claims
 */
export interface AuthUser {
  id: number;
  username: string;
  role: 'Admin' | 'User' | string;
  exp?: number;
}
