import type {
	Author,
	CreateAuthorRequest,
	CreateManyAuthorsRequest,
	PaginationAuthorQuery,
	SearchAuthorQuery,
	UpdateAuthorRequest,
} from '../types/authors';

import type { PaginatedResponse } from '../types';
import instance from '../configs/instances';

export const AuthorsAPI = {
	// Get all authors with pagination
	getAll: async (
		params?: PaginationAuthorQuery
	): Promise<PaginatedResponse<Author>> => {
		const res = await instance.get('/api/authors', { params });
		return res.data;
	},

	// Search authors
	search: async (
		params: SearchAuthorQuery
	): Promise<PaginatedResponse<Author>> => {
		const res = await instance.get('/api/authors/search', { params });
		return res.data;
	},

	// Get authors by nationality
	getByNationality: async (
		nationality: string,
		params?: PaginationAuthorQuery
	): Promise<PaginatedResponse<Author>> => {
		const res = await instance.get(`/api/authors/nationality/${nationality}`, {
			params,
		});
		return res.data;
	},

	// Get author by ID
	getById: async (id: string): Promise<Author> => {
		const res = await instance.get(`/api/authors/${id}`);
		return res.data;
	},

	// Get author by slug
	getBySlug: async (slug: string): Promise<Author> => {
		const res = await instance.get(`/api/authors/slug/${slug}`);
		return res.data;
	},

	// Create new author
	create: async (data: CreateAuthorRequest): Promise<Author> => {
		const res = await instance.post('/api/authors', data);
		return res.data;
	},

	// Create many authors
	createMany: async (data: CreateManyAuthorsRequest): Promise<Author[]> => {
		const res = await instance.post('/api/authors/bulk', data);
		return res.data;
	},

	// Update author by ID
	update: async (id: string, data: UpdateAuthorRequest): Promise<Author> => {
		const res = await instance.patch(`/api/authors/${id}`, data);
		return res.data;
	},

	// Update author by slug
	updateBySlug: async (
		slug: string,
		data: UpdateAuthorRequest
	): Promise<Author> => {
		const res = await instance.patch(`/api/authors/slug/${slug}`, data);
		return res.data;
	},

	// Delete author by ID
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/authors/${id}`);
	},

	// Delete author by slug
	deleteBySlug: async (slug: string): Promise<void> => {
		await instance.delete(`/api/authors/slug/${slug}`);
	},
};
