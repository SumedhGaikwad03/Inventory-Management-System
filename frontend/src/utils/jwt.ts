import type { AuthUser } from '../types/auth.types.ts';

/**
 * Parses payload from a standard JWT token without requiring third-party libraries.
 */

//basicallly an jwt auth files 
export function decodeJwt(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64Url = parts[1]; // this line decoded payload as it contain name , exp time etc 
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // prepare jwt for browsers decoder 
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    //json payload is a string 

    const payload = JSON.parse(jsonPayload); // that string is conveted to a javascript obj now 

    // ASP.NET Core ClaimTypes mapping
    const id = Number(
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      // the above part basically says that Give me the value stored under the claim named nameidentifier.
      payload.nameid ||
      payload.sub ||
      0
    );

    const username = String(
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
      payload.unique_name ||
      payload.name ||
      ''
    );

    const role = String(
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      payload.role ||
      'User'
    );

    const exp = payload.exp ? Number(payload.exp) : undefined;

    return { id, username, role, exp }; // we have our auth user ready and thats now sent back to the auth context 
  } catch {
    return null;
  }
}

/**
 * Checks if a JWT token has expired.
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}
