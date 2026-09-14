import type { ProblemDetails } from '../types/common.types.ts';
import axios from 'axios';

/**
 * Normalizes any API / Axios error into a clean human-readable error message.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      const data = error.response.data as ProblemDetails;

      // Check for detail field from ProblemDetails
      if (data.detail) {
        return data.detail;
      }

      // Check for validation errors dictionary
      if (data.errors && typeof data.errors === 'object') {
        const errorMessages = Object.values(data.errors).flat();
        if (errorMessages.length > 0) {
          return errorMessages.join(' ');
        }
      } // the error could be more than one string we join them all together 

      // Check for title field
      if (data.title) {
        return data.title;
      }

      // If data is a plain string
      if (typeof error.response.data === 'string') {
        return error.response.data;
      }
    }

    if (error.message) {
      if (error.code === 'ERR_NETWORK') {
        return 'Unable to reach the server. Please ensure the backend API is running.';
      }
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.'; // hadles truly weired cases 
}
