import type {
	CreateFineRequest,
	FineResponse,
	FineStatistics,
	FinesResponse,
} from '@/types/fines';

import instance from '@/configs/instances';

export const FinesAPI = {
	// Create a new fine
	create: async (data: CreateFineRequest): Promise<FineResponse> => {
		const res = await instance.post('/api/fines', data);
		return res.data;
	},

	// Get all fines with pagination
	getAll: async (params?: {
		page?: number;
		limit?: number;
	}): Promise<FinesResponse> => {
		const res = await instance.get('/api/fines', { params });
		return res.data;
	},

	// Get fines by status
	getByStatus: async (
		status: string,
		params?: {
			page?: number;
			limit?: number;
		}
	): Promise<FinesResponse> => {
		const res = await instance.get(`/api/fines/status/${status}`, { params });
		return res.data;
	},

	// Search fines
	search: async (
		query: string,
		params?: {
			page?: number;
			limit?: number;
		}
	): Promise<FinesResponse> => {
		const res = await instance.get('/api/fines/search', {
			params: { q: query, ...params },
		});
		return res.data;
	},

	// Get fine statistics
	getStats: async (): Promise<FineStatistics> => {
		const res = await instance.get('/api/fines/stats');
		return res.data;
	},

	// Export fines report
	exportReport: async (params?: {
		page?: number;
		limit?: number;
	}): Promise<Blob> => {
		const res = await instance.get('/api/fines/export', {
			params,
			responseType: 'blob',
		});
		return res.data;
	},

	// Pay fine
	payFine: async (
		id: string,
		data: {
			amount: number;
			paymentMethod: string;
			transactionId?: string;
		}
	): Promise<FineResponse> => {
		const res = await instance.patch(`/api/fines/${id}/pay`, data);
		return res.data;
	},

	// Get fine by ID
	getById: async (id: string): Promise<FineResponse> => {
		const res = await instance.get(`/api/fines/${id}`);
		return res.data;
	},

	// Update fine
	update: async (
		id: string,
		data: Partial<CreateFineRequest>
	): Promise<FineResponse> => {
		const res = await instance.patch(`/api/fines/${id}`, data);
		return res.data;
	},

	// Delete fine
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/fines/${id}`);
	},
};
