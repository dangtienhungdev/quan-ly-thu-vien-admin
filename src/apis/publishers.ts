import type {
	BulkCreateResult,
	CreateManyPublishersRequest,
	CreatePublisherRequest,
	PaginationPublisherQuery,
	Publisher,
	PublisherStats,
	SearchPublisherQuery,
	UpdatePublisherRequest,
} from '../types/publishers';

import type { PaginatedResponse } from '../types';
import instance from '../configs/instances';

export const PublishersAPI = {
	// Get all publishers with pagination
	getAll: async (
		params?: PaginationPublisherQuery
	): Promise<PaginatedResponse<Publisher>> => {
		const res = await instance.get('/api/publishers', { params });
		return res.data;
	},

	// Search publishers
	search: async (
		params: SearchPublisherQuery
	): Promise<PaginatedResponse<Publisher>> => {
		const res = await instance.get('/api/publishers/search', { params });
		return res.data;
	},

	// Get publishers by status
	getByStatus: async (
		isActive: boolean,
		params?: PaginationPublisherQuery
	): Promise<PaginatedResponse<Publisher>> => {
		const res = await instance.get(`/api/publishers/status/${isActive}`, {
			params,
		});
		return res.data;
	},

	// Get publishers by country
	getByCountry: async (
		country: string,
		params?: PaginationPublisherQuery
	): Promise<PaginatedResponse<Publisher>> => {
		const res = await instance.get(`/api/publishers/country/${country}`, {
			params,
		});
		return res.data;
	},

	// Get publisher statistics
	getStats: async (): Promise<PublisherStats> => {
		const res = await instance.get('/api/publishers/stats');
		return res.data;
	},

	// Get publisher by ID
	getById: async (id: string): Promise<Publisher> => {
		const res = await instance.get(`/api/publishers/${id}`);
		return res.data;
	},

	// Get publisher by slug
	getBySlug: async (slug: string): Promise<Publisher> => {
		const res = await instance.get(`/api/publishers/slug/${slug}`);
		return res.data;
	},

	// Create new publisher
	create: async (data: CreatePublisherRequest): Promise<Publisher> => {
		const res = await instance.post('/api/publishers', data);
		return res.data;
	},

	// Create many publishers
	createMany: async (
		data: CreateManyPublishersRequest
	): Promise<BulkCreateResult> => {
		const res = await instance.post('/api/publishers/bulk', data);
		return res.data;
	},

	// Update publisher by ID
	update: async (
		id: string,
		data: UpdatePublisherRequest
	): Promise<Publisher> => {
		const res = await instance.patch(`/api/publishers/${id}`, data);
		return res.data;
	},

	// Update publisher by slug
	updateBySlug: async (
		slug: string,
		data: UpdatePublisherRequest
	): Promise<Publisher> => {
		const res = await instance.patch(`/api/publishers/slug/${slug}`, data);
		return res.data;
	},

	// Toggle publisher status
	toggleStatus: async (id: string): Promise<Publisher> => {
		const res = await instance.patch(`/api/publishers/${id}/toggle-status`);
		return res.data;
	},

	// Delete publisher by ID
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/publishers/${id}`);
	},

	// Delete publisher by slug
	deleteBySlug: async (slug: string): Promise<void> => {
		await instance.delete(`/api/publishers/slug/${slug}`);
	},
};
