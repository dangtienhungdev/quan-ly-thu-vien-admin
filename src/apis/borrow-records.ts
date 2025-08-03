import type {
	BorrowRecordCopyQuery,
	BorrowRecordDateRangeQuery,
	BorrowRecordLibrarianQuery,
	BorrowRecordOverdueQuery,
	BorrowRecordReaderQuery,
	BorrowRecordResponse,
	BorrowRecordSearchQuery,
	BorrowRecordsResponse,
	BorrowRecordStatsResponse,
	BorrowRecordStatusQuery,
	CreateBorrowRecordRequest,
	RenewBookRequest,
	ReturnBookRequest,
	UpdateBorrowRecordRequest,
} from '../types';

import instance from '../configs/instances';

export const BorrowRecordsAPI = {
	// Create a new borrow record
	create: async (
		data: CreateBorrowRecordRequest
	): Promise<BorrowRecordResponse> => {
		const res = await instance.post('/api/borrow-records', data);
		return res.data;
	},

	// Get all borrow records with pagination
	getAll: async (params?: {
		page?: number;
		limit?: number;
	}): Promise<BorrowRecordsResponse> => {
		const res = await instance.get('/api/borrow-records', { params });
		return res.data;
	},

	// Search borrow records
	search: async (
		params: BorrowRecordSearchQuery
	): Promise<BorrowRecordsResponse> => {
		const res = await instance.get('/api/borrow-records/search', { params });
		return res.data;
	},

	// Get borrow records by status
	getByStatus: async (
		params: BorrowRecordStatusQuery
	): Promise<BorrowRecordsResponse> => {
		const res = await instance.get(
			`/api/borrow-records/status/${params.status}`,
			{ params }
		);
		return res.data;
	},

	// Get borrow records by reader
	getByReader: async (
		params: BorrowRecordReaderQuery
	): Promise<BorrowRecordsResponse> => {
		const res = await instance.get(
			`/api/borrow-records/reader/${params.readerId}`,
			{ params }
		);
		return res.data;
	},

	// Get borrow records by copy
	getByCopy: async (
		params: BorrowRecordCopyQuery
	): Promise<BorrowRecordsResponse> => {
		const res = await instance.get(
			`/api/borrow-records/copy/${params.copyId}`,
			{ params }
		);
		return res.data;
	},

	// Get borrow records by librarian
	getByLibrarian: async (
		params: BorrowRecordLibrarianQuery
	): Promise<BorrowRecordsResponse> => {
		const res = await instance.get(
			`/api/borrow-records/librarian/${params.librarianId}`,
			{ params }
		);
		return res.data;
	},

	// Get borrow records by date range
	getByDateRange: async (
		params: BorrowRecordDateRangeQuery
	): Promise<BorrowRecordsResponse> => {
		const res = await instance.get('/api/borrow-records/date-range', {
			params,
		});
		return res.data;
	},

	// Get overdue borrow records
	getOverdue: async (
		params?: BorrowRecordOverdueQuery
	): Promise<BorrowRecordsResponse> => {
		const res = await instance.get('/api/borrow-records/overdue', { params });
		return res.data;
	},

	// Get borrow records statistics
	getStats: async (): Promise<BorrowRecordStatsResponse> => {
		const res = await instance.get('/api/borrow-records/stats');
		return res.data;
	},

	// Get borrow record by ID
	getById: async (id: string): Promise<BorrowRecordResponse> => {
		const res = await instance.get(`/api/borrow-records/${id}`);
		return res.data;
	},

	// Update borrow record
	update: async (
		id: string,
		data: UpdateBorrowRecordRequest
	): Promise<BorrowRecordResponse> => {
		const res = await instance.patch(`/api/borrow-records/${id}`, data);
		return res.data;
	},

	// Return a book
	returnBook: async (
		id: string,
		data: ReturnBookRequest
	): Promise<BorrowRecordResponse> => {
		const res = await instance.patch(`/api/borrow-records/${id}/return`, data);
		return res.data;
	},

	// Renew a book
	renewBook: async (
		id: string,
		data: RenewBookRequest
	): Promise<BorrowRecordResponse> => {
		const res = await instance.patch(`/api/borrow-records/${id}/renew`, data);
		return res.data;
	},

	// Delete borrow record
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/borrow-records/${id}`);
	},
};
