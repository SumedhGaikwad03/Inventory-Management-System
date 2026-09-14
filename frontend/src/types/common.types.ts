/**
 * ASP.NET Core ProblemDetails error response format (RFC 7807)
 */
export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

/**
 * Common pagination metadata wrapper (matches ProductPagedResponseDto shape)
 */
export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
