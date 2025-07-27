import type {
	Category,
	CreateCategoryRequest,
	PaginationCategoryQuery,
	SearchCategoryQuery,
	UpdateCategoryRequest,
} from '../types/categories';

import type { PaginatedResponse } from '../types';
import instance from '../configs/instances';

export const CategoriesAPI = {
	// Get all categories with pagination
	getAll: async (
		params?: PaginationCategoryQuery
	): Promise<PaginatedResponse<Category>> => {
		const res = await instance.get('/api/categories', { params });
		return res.data;
	},

	// Get main categories (no parent)
	getMain: async (
		params?: PaginationCategoryQuery
	): Promise<PaginatedResponse<Category>> => {
		const res = await instance.get('/api/categories/main', { params });
		return res.data;
	},

	// Get subcategories of a category
	getSubcategories: async (
		id: string,
		params?: PaginationCategoryQuery
	): Promise<PaginatedResponse<Category>> => {
		const res = await instance.get(`/api/categories/${id}/subcategories`, {
			params,
		});
		return res.data;
	},

	// Search categories
	search: async (
		params: SearchCategoryQuery
	): Promise<PaginatedResponse<Category>> => {
		const res = await instance.get('/api/categories/search', { params });
		return res.data;
	},

	// Get category by ID
	getById: async (id: string): Promise<Category> => {
		const res = await instance.get(`/api/categories/${id}`);
		return res.data;
	},

	// Get category by slug
	getBySlug: async (slug: string): Promise<Category> => {
		const res = await instance.get(`/api/categories/slug/${slug}`);
		return res.data;
	},

	// Create new category
	create: async (data: CreateCategoryRequest): Promise<Category> => {
		const res = await instance.post('/api/categories', data);
		return res.data;
	},

	// Update category by ID
	update: async (
		id: string,
		data: UpdateCategoryRequest
	): Promise<Category> => {
		const res = await instance.patch(`/api/categories/${id}`, data);
		return res.data;
	},

	// Update category by slug
	updateBySlug: async (
		slug: string,
		data: UpdateCategoryRequest
	): Promise<Category> => {
		const res = await instance.patch(`/api/categories/slug/${slug}`, data);
		return res.data;
	},

	// Delete category by ID
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/categories/${id}`);
	},

	// Delete category by slug
	deleteBySlug: async (slug: string): Promise<void> => {
		await instance.delete(`/api/categories/slug/${slug}`);
	},
};
