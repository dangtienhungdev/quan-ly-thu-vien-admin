import type {
	AuthorByNationalityQuery,
	AuthorResponse,
	AuthorSearchQuery,
	AuthorsResponse,
	BulkCreateAuthorRequest,
	BulkCreateAuthorResponse,
	CreateAuthorRequest,
	PaginationQuery,
	UpdateAuthorRequest,
} from '../types';

import instance from '../configs/instances';

export const AuthorsAPI = {
	// Get all authors with pagination
	getAll: async (params?: PaginationQuery): Promise<AuthorsResponse> => {
		const res = await instance.get('/authors', { params });
		return res.data;
	},

	// Get author by ID
	getById: async (id: string): Promise<AuthorResponse> => {
		const res = await instance.get(`/authors/${id}`);
		return res.data;
	},

	// Get author by slug
	getBySlug: async (slug: string): Promise<AuthorResponse> => {
		const res = await instance.get(`/authors/slug/${slug}`);
		return res.data;
	},

	// Create a new author
	create: async (data: CreateAuthorRequest): Promise<AuthorResponse> => {
		const res = await instance.post('/authors', data);
		return res.data;
	},

	// Create multiple authors
	createBulk: async (
		data: BulkCreateAuthorRequest
	): Promise<BulkCreateAuthorResponse> => {
		const res = await instance.post('/authors/bulk', data);
		return res.data;
	},

	// Update author by ID
	update: async (
		id: string,
		data: UpdateAuthorRequest
	): Promise<AuthorResponse> => {
		const res = await instance.patch(`/authors/${id}`, data);
		return res.data;
	},

	// Update author by slug
	updateBySlug: async (
		slug: string,
		data: UpdateAuthorRequest
	): Promise<AuthorResponse> => {
		const res = await instance.patch(`/authors/slug/${slug}`, data);
		return res.data;
	},

	// Delete author by ID
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/authors/${id}`);
	},

	// Delete author by slug
	deleteBySlug: async (slug: string): Promise<void> => {
		await instance.delete(`/authors/slug/${slug}`);
	},

	// Search authors
	search: async (params: AuthorSearchQuery): Promise<AuthorsResponse> => {
		const res = await instance.get('/authors/search', { params });
		return res.data;
	},

	// Get authors by nationality
	getByNationality: async (
		params: AuthorByNationalityQuery
	): Promise<AuthorsResponse> => {
		const res = await instance.get(
			`/authors/nationality/${params.nationality}`,
			{
				params: { page: params.page, limit: params.limit },
			}
		);
		return res.data;
	},
};
