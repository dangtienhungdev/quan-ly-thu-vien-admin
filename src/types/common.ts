// Common types used across the application

export interface PaginationMeta {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: PaginationMeta;
}

export interface BaseEntity {
	id: string;
	created_at: string;
	updated_at: string;
}

export interface AuthResponse {
	access_token: string;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface ChangePasswordRequest {
	currentPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	newPassword: string;
	confirmNewPassword: string;
}

export interface ApiError {
	statusCode: number;
	message: string;
	error: string;
}

// Book types
export type BookType = 'physical' | 'ebook';
export type PhysicalType = 'library_use' | 'borrowable';

// Common query parameters
export interface PaginationQuery {
	page?: number;
	limit?: number;
}

export interface SearchQuery extends PaginationQuery {
	q: string;
}
