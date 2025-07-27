import type {
	BulkCreatePublisherRequest,
	BulkCreatePublisherResponse,
	CreatePublisherRequest,
	PaginationQuery,
	PublisherResponse,
	PublisherSearchQuery,
	PublishersResponse,
	UpdatePublisherRequest,
} from '../types';

import instance from '../configs/instances';

export const PublishersAPI = {
	// Get all publishers with pagination
	getAll: async (params?: PaginationQuery): Promise<PublishersResponse> => {
		const res = await instance.get('/publishers', { params });
		return res.data;
	},

	// Get publisher by ID
	getById: async (id: string): Promise<PublisherResponse> => {
		const res = await instance.get(`/publishers/${id}`);
		return res.data;
	},

	// Get publisher by slug
	getBySlug: async (slug: string): Promise<PublisherResponse> => {
		const res = await instance.get(`/publishers/slug/${slug}`);
		return res.data;
	},

	// Create a new publisher
	create: async (data: CreatePublisherRequest): Promise<PublisherResponse> => {
		const res = await instance.post('/publishers', data);
		return res.data;
	},

	// Create multiple publishers
	createBulk: async (
		data: BulkCreatePublisherRequest
	): Promise<BulkCreatePublisherResponse> => {
		const res = await instance.post('/publishers/bulk', data);
		return res.data;
	},

	// Update publisher by ID
	update: async (
		id: string,
		data: UpdatePublisherRequest
	): Promise<PublisherResponse> => {
		const res = await instance.patch(`/publishers/${id}`, data);
		return res.data;
	},

	// Update publisher by slug
	updateBySlug: async (
		slug: string,
		data: UpdatePublisherRequest
	): Promise<PublisherResponse> => {
		const res = await instance.patch(`/publishers/slug/${slug}`, data);
		return res.data;
	},

	// Delete publisher by ID
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/publishers/${id}`);
	},

	// Delete publisher by slug
	deleteBySlug: async (slug: string): Promise<void> => {
		await instance.delete(`/publishers/slug/${slug}`);
	},

	// Search publishers
	search: async (params: PublisherSearchQuery): Promise<PublishersResponse> => {
		const res = await instance.get('/publishers/search', { params });
		return res.data;
	},
};
