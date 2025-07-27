import type {
	CreateReaderTypeRequest,
	DefaultSettings,
	PaginationReaderTypeQuery,
	ReaderTypeConfig,
	ReaderTypeStatistics,
	UpdateReaderTypeRequest,
} from '../types/reader-types';

import type { PaginatedResponse } from '../types';
import instance from '../configs/instances';

export const ReaderTypesAPI = {
	// Get all reader types with pagination
	getAll: async (
		params?: PaginationReaderTypeQuery
	): Promise<PaginatedResponse<ReaderTypeConfig>> => {
		const res = await instance.get('/api/reader-types', { params });
		return res.data;
	},

	// Get reader type by ID
	getById: async (id: string): Promise<ReaderTypeConfig> => {
		const res = await instance.get(`/api/reader-types/${id}`);
		return res.data;
	},

	// Create new reader type
	create: async (data: CreateReaderTypeRequest): Promise<ReaderTypeConfig> => {
		const res = await instance.post('/api/reader-types', data);
		return res.data;
	},

	// Update reader type by ID
	update: async (
		id: string,
		data: UpdateReaderTypeRequest
	): Promise<ReaderTypeConfig> => {
		const res = await instance.patch(`/api/reader-types/${id}`, data);
		return res.data;
	},

	// Delete reader type by ID
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/reader-types/${id}`);
	},

	// Get statistics
	getStatistics: async (): Promise<{ statistics: ReaderTypeStatistics[] }> => {
		const res = await instance.get('/api/reader-types/statistics');
		return res.data;
	},

	// Get default settings
	getDefaultSettings: async (): Promise<DefaultSettings> => {
		const res = await instance.get('/api/reader-types/default-settings');
		return res.data;
	},
};
