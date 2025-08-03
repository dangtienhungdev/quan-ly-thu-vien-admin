import type {
	ApproveRenewalRequest,
	CreateRenewalRequest,
	RejectRenewalRequest,
	RenewalBorrowQuery,
	RenewalLibrarianQuery,
	RenewalResponse,
	RenewalSearchQuery,
	RenewalStatsResponse,
	RenewalStatusQuery,
	RenewalsResponse,
	UpdateRenewalRequest,
} from '@/types/renewals';

import instance from '../configs/instances';

export const RenewalsAPI = {
	// Create a new renewal
	create: async (data: CreateRenewalRequest): Promise<RenewalResponse> => {
		const res = await instance.post('/api/renewals', data);
		return res.data;
	},

	// Get all renewals with pagination
	getAll: async (params?: {
		page?: number;
		limit?: number;
	}): Promise<RenewalsResponse> => {
		const res = await instance.get('/api/renewals', { params });
		return res.data;
	},

	// Search renewals
	search: async (params: RenewalSearchQuery): Promise<RenewalsResponse> => {
		const res = await instance.get('/api/renewals/search', { params });
		return res.data;
	},

	// Get renewals by status
	getByStatus: async (
		params: RenewalStatusQuery
	): Promise<RenewalsResponse> => {
		const res = await instance.get(`/api/renewals/status/${params.status}`, {
			params,
		});
		return res.data;
	},

	// Get renewals by borrow record
	getByBorrow: async (
		params: RenewalBorrowQuery
	): Promise<RenewalsResponse> => {
		const res = await instance.get(`/api/renewals/borrow/${params.borrowId}`, {
			params,
		});
		return res.data;
	},

	// Get renewals by librarian
	getByLibrarian: async (
		params: RenewalLibrarianQuery
	): Promise<RenewalsResponse> => {
		const res = await instance.get(
			`/api/renewals/librarian/${params.librarianId}`,
			{ params }
		);
		return res.data;
	},

	// Get renewals statistics
	getStats: async (): Promise<RenewalStatsResponse> => {
		const res = await instance.get('/api/renewals/stats');
		return res.data;
	},

	// Get renewal by ID
	getById: async (id: string): Promise<RenewalResponse> => {
		const res = await instance.get(`/api/renewals/${id}`);
		return res.data;
	},

	// Update renewal
	update: async (
		id: string,
		data: UpdateRenewalRequest
	): Promise<RenewalResponse> => {
		const res = await instance.patch(`/api/renewals/${id}`, data);
		return res.data;
	},

	// Approve renewal
	approve: async (
		id: string,
		data: ApproveRenewalRequest
	): Promise<RenewalResponse> => {
		const res = await instance.patch(`/api/renewals/${id}/approve`, data);
		return res.data;
	},

	// Reject renewal
	reject: async (
		id: string,
		data: RejectRenewalRequest
	): Promise<RenewalResponse> => {
		const res = await instance.patch(`/api/renewals/${id}/reject`, data);
		return res.data;
	},

	// Delete renewal
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/renewals/${id}`);
	},
};
