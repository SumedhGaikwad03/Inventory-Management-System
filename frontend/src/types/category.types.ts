/**
 * Matches backend CategoryResponseDto
 */
export interface CategoryResponseDto {
  id: number;
  name: string;
  description: string | null;
  createdDate: string;
}

/**
 * Matches backend CreateCategoryDto
 */
export interface CreateCategoryDto {
  name: string;
  description?: string | null;
}

/**
 * Matches backend UpdateCategoryDto
 */
export interface UpdateCategoryDto {
  name: string;
  description?: string | null;
}
