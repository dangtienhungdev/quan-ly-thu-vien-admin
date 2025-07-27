import type {
	CategoriesResponse,
	CategoryResponse,
	CategorySearchQuery,
	CreateCategoryRequest,
	MainCategoriesResponse,
	PaginationQuery,
	SubcategoriesQuery,
	SubcategoriesResponse,
	UpdateCategoryRequest,
} from '../types';

import instance from '../configs/instances';

export const CategoriesAPI = {
	// Get all categories with pagination
	getAll: async (params?: PaginationQuery): Promise<CategoriesResponse> => {
		const res = await instance.get('/categories', { params });
		return res.data;
	},

	// Get main categories (no parent)
	getMain: async (
		params?: PaginationQuery
	): Promise<MainCategoriesResponse> => {
		const res = await instance.get('/categories/main', { params });
		return res.data;
	},

	// Get category by ID
	getById: async (id: string): Promise<CategoryResponse> => {
		const res = await instance.get(`/categories/${id}`);
		return res.data;
	},

	// Get category by slug
	getBySlug: async (slug: string): Promise<CategoryResponse> => {
		const res = await instance.get(`/categories/slug/${slug}`);
		return res.data;
	},

	// Get subcategories of a category
	getSubcategories: async (
		params: SubcategoriesQuery
	): Promise<SubcategoriesResponse> => {
		const res = await instance.get(`/categories/${params.id}/subcategories`, {
			params: { page: params.page, limit: params.limit },
		});
		return res.data;
	},

	// Create a new category
	create: async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
		const res = await instance.post('/categories', data);
		return res.data;
	},

	// Update category by ID
	update: async (
		id: string,
		data: UpdateCategoryRequest
	): Promise<CategoryResponse> => {
		const res = await instance.patch(`/categories/${id}`, data);
		return res.data;
	},

	// Update category by slug
	updateBySlug: async (
		slug: string,
		data: UpdateCategoryRequest
	): Promise<CategoryResponse> => {
		const res = await instance.patch(`/categories/slug/${slug}`, data);
		return res.data;
	},

	// Delete category by ID
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/categories/${id}`);
	},

	// Delete category by slug
	deleteBySlug: async (slug: string): Promise<void> => {
		await instance.delete(`/categories/slug/${slug}`);
	},

	// Search categories
	search: async (params: CategorySearchQuery): Promise<CategoriesResponse> => {
		const res = await instance.get('/categories/search', { params });
		return res.data;
	},
};
