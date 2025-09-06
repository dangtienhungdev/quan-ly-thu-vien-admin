import type {
	BulkCreatePhysicalCopiesResponse,
	CreateManyPhysicalCopiesRequest,
	CreatePhysicalCopyRequest,
	PhysicalCopiesResponse,
	PhysicalCopyBookQuery,
	PhysicalCopyConditionQuery,
	PhysicalCopyLocationQuery,
	PhysicalCopyResponse,
	PhysicalCopySearchQuery,
	PhysicalCopyStatsResponse,
	PhysicalCopyStatusQuery,
	UpdateCopyConditionRequest,
	UpdateCopyStatusRequest,
	UpdatePhysicalCopyRequest,
} from '../types';

import instance from '../configs/instances';

export const PhysicalCopiesAPI = {
	// Create a new physical copy
	create: async (
		data: CreatePhysicalCopyRequest
	): Promise<PhysicalCopyResponse> => {
		const res = await instance.post('/api/physical-copies', data);
		return res.data;
	},

	// Create multiple physical copies for a book
	createMany: async (
		bookId: string,
		data: CreateManyPhysicalCopiesRequest
	): Promise<BulkCreatePhysicalCopiesResponse> => {
		const res = await instance.post(
			`/api/physical-copies/book/${bookId}/many`,
			data
		);
		return res.data;
	},

	// Get all physical copies with pagination
	getAll: async (params?: {
		page?: number;
		limit?: number;
	}): Promise<PhysicalCopiesResponse> => {
		const res = await instance.get('/api/physical-copies', { params });
		return res.data;
	},

	// Search physical copies
	search: async (
		params: PhysicalCopySearchQuery
	): Promise<PhysicalCopiesResponse> => {
		const res = await instance.get('/api/physical-copies/search', { params });
		return res.data;
	},

	// Get physical copies by status
	getByStatus: async (
		params: PhysicalCopyStatusQuery
	): Promise<PhysicalCopiesResponse> => {
		const res = await instance.get(
			`/api/physical-copies/status/${params.status}`,
			{ params }
		);
		return res.data;
	},

	// Get physical copies by condition
	getByCondition: async (
		params: PhysicalCopyConditionQuery
	): Promise<PhysicalCopiesResponse> => {
		const res = await instance.get(
			`/api/physical-copies/condition/${params.condition}`,
			{ params }
		);
		return res.data;
	},

	// Get physical copies by location
	getByLocation: async (
		params: PhysicalCopyLocationQuery
	): Promise<PhysicalCopiesResponse> => {
		const res = await instance.get(
			`/api/physical-copies/location/${params.locationId}`,
			{ params }
		);
		return res.data;
	},

	// Get available physical copies
	getAvailable: async (params?: {
		page?: number;
		limit?: number;
	}): Promise<PhysicalCopiesResponse> => {
		const res = await instance.get('/api/physical-copies/available', {
			params,
		});
		return res.data;
	},

	// Get physical copies needing maintenance
	getMaintenance: async (params?: {
		page?: number;
		limit?: number;
	}): Promise<PhysicalCopiesResponse> => {
		const res = await instance.get('/api/physical-copies/maintenance', {
			params,
		});
		return res.data;
	},

	// Get physical copies statistics
	getStats: async (): Promise<PhysicalCopyStatsResponse> => {
		const res = await instance.get('/api/physical-copies/stats');
		return res.data;
	},

	// Get physical copies by book
	getByBook: async (
		bookId: string,
		params?: PhysicalCopyBookQuery
	): Promise<PhysicalCopiesResponse> => {
		const res = await instance.get(`/api/physical-copies/book/${bookId}`, {
			params,
		});
		return res.data;
	},

	// Get physical copy by barcode
	getByBarcode: async (barcode: string): Promise<PhysicalCopyResponse> => {
		const res = await instance.get(`/api/physical-copies/barcode/${barcode}`);
		return res.data;
	},

	// Get physical copy by ID
	getById: async (id: string): Promise<PhysicalCopyResponse> => {
		const res = await instance.get(`/api/physical-copies/${id}`);
		return res.data;
	},

	// Update physical copy
	update: async (
		id: string,
		data: UpdatePhysicalCopyRequest
	): Promise<PhysicalCopyResponse> => {
		const res = await instance.patch(`/api/physical-copies/${id}`, data);
		return res.data;
	},

	// Update physical copy status
	updateStatus: async (
		id: string,
		data: UpdateCopyStatusRequest
	): Promise<PhysicalCopyResponse> => {
		const res = await instance.patch(`/api/physical-copies/${id}/status`, data);
		return res.data;
	},

	// Update physical copy condition
	updateCondition: async (
		id: string,
		data: UpdateCopyConditionRequest
	): Promise<PhysicalCopyResponse> => {
		const res = await instance.patch(
			`/api/physical-copies/${id}/condition`,
			data
		);
		return res.data;
	},

	// Archive/Unarchive physical copy
	toggleArchive: async (id: string): Promise<PhysicalCopyResponse> => {
		const res = await instance.patch(`/api/physical-copies/${id}/archive`);
		return res.data;
	},

	// Delete physical copy
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/physical-copies/${id}`);
	},
};
