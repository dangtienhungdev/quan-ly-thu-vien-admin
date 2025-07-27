import type { BaseEntity, PaginatedResponse } from './common';

export interface Category extends BaseEntity {
	category_name: string;
	slug: string;
	description?: string;
	parent_id?: string;
	parent?: Category;
	children?: Category[];
}

export interface CreateCategoryRequest {
	category_name: string;
	description?: string;
	parent_id?: string;
}

export interface UpdateCategoryRequest {
	category_name?: string;
	description?: string;
	parent_id?: string;
}

export interface CategorySearchQuery {
	q: string;
	page?: number;
	limit?: number;
}

export interface SubcategoriesQuery {
	id: string;
	page?: number;
	limit?: number;
}

export type CategoriesResponse = PaginatedResponse<Category>;
export type CategoryResponse = Category;
export type MainCategoriesResponse = PaginatedResponse<Category>;
export type SubcategoriesResponse = PaginatedResponse<Category>;
