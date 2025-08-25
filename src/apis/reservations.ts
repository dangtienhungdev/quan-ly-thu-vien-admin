import type {
	BulkReservationsResponse,
	CreateMultipleReservationsRequest,
	CreateReservationRequest,
	ReservationBookQuery,
	ReservationDateRangeQuery,
	ReservationExpiringSoonQuery,
	ReservationExpiringSoonResponse,
	ReservationReaderQuery,
	ReservationResponse,
	ReservationSearchQuery,
	ReservationStatsResponse,
	ReservationStatus,
	ReservationStatusQuery,
	ReservationsResponse,
	ReservationsStatsByStatusResponse,
	UpdateReservationRequest,
} from '../types';

import instance from '../configs/instances';

export const ReservationsAPI = {
	// Create a new reservation
	create: async (
		data: CreateReservationRequest
	): Promise<ReservationResponse> => {
		const res = await instance.post('/api/reservations', data);
		return res.data;
	},

	// Create multiple reservations
	createBulk: async (
		data: CreateMultipleReservationsRequest
	): Promise<BulkReservationsResponse> => {
		const res = await instance.post('/api/reservations/bulk', data);
		return res.data;
	},

	// Get all reservations with pagination
	getAll: async (params?: {
		page?: number;
		limit?: number;
	}): Promise<ReservationsResponse> => {
		const res = await instance.get('/api/reservations', { params });
		return res.data;
	},

	// Search reservations
	search: async (
		params: ReservationSearchQuery
	): Promise<ReservationsResponse> => {
		const res = await instance.get('/api/reservations/search', { params });
		return res.data;
	},

	// Get reservations by status
	getByStatus: async (
		status: ReservationStatus,
		params?: ReservationStatusQuery
	): Promise<ReservationsResponse> => {
		const res = await instance.get(`/api/reservations/status/${status}`, {
			params,
		});
		return res.data;
	},

	// Get reservations by reader
	getByReader: async (
		params: ReservationReaderQuery
	): Promise<ReservationsResponse> => {
		const res = await instance.get(
			`/api/reservations/reader/${params.readerId}`,
			{ params }
		);
		return res.data;
	},

	// Get reservations by book
	getByBook: async (
		params: ReservationBookQuery
	): Promise<ReservationsResponse> => {
		const res = await instance.get(`/api/reservations/book/${params.bookId}`, {
			params,
		});
		return res.data;
	},

	// Get reservations by date range
	getByDateRange: async (
		params: ReservationDateRangeQuery
	): Promise<ReservationsResponse> => {
		const res = await instance.get('/api/reservations/date-range', { params });
		return res.data;
	},

	// Get reservations expiring soon
	getExpiringSoon: async (
		params: ReservationExpiringSoonQuery
	): Promise<ReservationExpiringSoonResponse> => {
		const res = await instance.get(`/api/reservations/expiring-soon`, {
			params,
		});
		return res.data;
	},

	// Get reservations statistics
	getStats: async (): Promise<ReservationStatsResponse> => {
		const res = await instance.get('/api/reservations/stats');
		return res.data;
	},

	// Get reservations statistics by status
	getStatsByStatus: async (): Promise<ReservationsStatsByStatusResponse> => {
		const res = await instance.get('/api/reservations/stats/by-status');
		return res.data;
	},

	// Get reservation by ID
	getById: async (id: string): Promise<ReservationResponse> => {
		const res = await instance.get(`/api/reservations/${id}`);
		return res.data;
	},

	// Update reservation
	update: async (
		id: string,
		data: UpdateReservationRequest
	): Promise<ReservationResponse> => {
		const res = await instance.patch(`/api/reservations/${id}`, data);
		return res.data;
	},

	// Cancel reservation
	cancel: async (
		id: string,
		data: { librarianId: string; reason?: string }
	): Promise<ReservationResponse> => {
		const res = await instance.patch(`/api/reservations/${id}/cancel`, data);
		return res.data;
	},

	// Expire reservation
	expire: async (
		id: string,
		data: { librarianId: string; reason?: string }
	): Promise<ReservationResponse> => {
		const res = await instance.patch(`/api/reservations/${id}/expire`, data);
		return res.data;
	},

	// Fulfill reservation
	fulfill: async (
		id: string,
		data: { librarianId: string; notes?: string }
	): Promise<ReservationResponse> => {
		const res = await instance.patch(`/api/reservations/${id}/fulfill`, data);
		return res.data;
	},

	// Auto cancel expired reservations
	autoCancelExpired: async (): Promise<{ cancelledCount: number }> => {
		const res = await instance.post('/api/reservations/auto-cancel-expired');
		return res.data;
	},

	// Delete reservation
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/reservations/${id}`);
	},
};
