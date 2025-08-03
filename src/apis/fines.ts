import type {
	CreateFineRequest,
	Fine,
	FinePaymentRequest,
	FineStatistics,
	FineWithBorrowDetails,
	PaginatedResponse,
	PaginationFineQuery,
	UpdateFineRequest,
} from '@/types';
import instance from '../configs/instances';

const BASE_URL = '/fines';

export const finesApi = {
	// Tạo phạt mới
	create: async (data: CreateFineRequest): Promise<Fine> => {
		const response = await instance.post(BASE_URL, data);
		return response.data;
	},

	// Lấy danh sách phạt có phân trang
	getAll: async (
		params?: PaginationFineQuery
	): Promise<PaginatedResponse<FineWithBorrowDetails>> => {
		const response = await instance.get(BASE_URL, { params });
		return response.data;
	},

	// Tìm kiếm phạt
	search: async (
		query: string,
		params?: PaginationFineQuery
	): Promise<PaginatedResponse<FineWithBorrowDetails>> => {
		const response = await instance.get(`${BASE_URL}/search`, {
			params: { q: query, ...params },
		});
		return response.data;
	},

	// Lọc theo trạng thái
	getByStatus: async (
		status: 'unpaid' | 'paid',
		params?: PaginationFineQuery
	): Promise<PaginatedResponse<FineWithBorrowDetails>> => {
		const response = await instance.get(`${BASE_URL}/status/${status}`, {
			params,
		});
		return response.data;
	},

	// Lọc theo lý do
	getByReason: async (
		reason: string,
		params?: PaginationFineQuery
	): Promise<PaginatedResponse<FineWithBorrowDetails>> => {
		const response = await instance.get(`${BASE_URL}/reason/${reason}`, {
			params,
		});
		return response.data;
	},

	// Lọc theo độc giả
	getByReader: async (
		readerId: string,
		params?: PaginationFineQuery
	): Promise<PaginatedResponse<FineWithBorrowDetails>> => {
		const response = await instance.get(`${BASE_URL}/reader/${readerId}`, {
			params,
		});
		return response.data;
	},

	// Lọc theo sách
	getByBook: async (
		bookId: string,
		params?: PaginationFineQuery
	): Promise<PaginatedResponse<FineWithBorrowDetails>> => {
		const response = await instance.get(`${BASE_URL}/book/${bookId}`, {
			params,
		});
		return response.data;
	},

	// Lọc theo khoảng thời gian
	getByDateRange: async (
		startDate: string,
		endDate: string,
		params?: PaginationFineQuery
	): Promise<PaginatedResponse<FineWithBorrowDetails>> => {
		const response = await instance.get(`${BASE_URL}/date-range`, {
			params: { start_date: startDate, end_date: endDate, ...params },
		});
		return response.data;
	},

	// Phạt chưa thanh toán
	getUnpaid: async (
		params?: PaginationFineQuery
	): Promise<PaginatedResponse<FineWithBorrowDetails>> => {
		const response = await instance.get(`${BASE_URL}/unpaid`, { params });
		return response.data;
	},

	// Phạt đã thanh toán
	getPaid: async (
		params?: PaginationFineQuery
	): Promise<PaginatedResponse<FineWithBorrowDetails>> => {
		const response = await instance.get(`${BASE_URL}/paid`, { params });
		return response.data;
	},

	// Thống kê phạt
	getStatistics: async (): Promise<FineStatistics> => {
		const response = await instance.get(`${BASE_URL}/stats`);
		return response.data;
	},

	// Lấy chi tiết phạt
	getById: async (id: string): Promise<FineWithBorrowDetails> => {
		const response = await instance.get(`${BASE_URL}/${id}`);
		return response.data;
	},

	// Cập nhật phạt
	update: async (id: string, data: UpdateFineRequest): Promise<Fine> => {
		const response = await instance.patch(`${BASE_URL}/${id}`, data);
		return response.data;
	},

	// Thanh toán phạt
	pay: async (id: string, data: FinePaymentRequest): Promise<Fine> => {
		const response = await instance.post(`${BASE_URL}/${id}/pay`, data);
		return response.data;
	},

	// Xóa phạt
	delete: async (id: string): Promise<void> => {
		await instance.delete(`${BASE_URL}/${id}`);
	},

	// Xóa nhiều phạt
	deleteBatch: async (ids: string[]): Promise<void> => {
		await instance.delete(`${BASE_URL}/batch`, { data: { ids } });
	},

	// Xuất báo cáo phạt
	exportReport: async (params?: PaginationFineQuery): Promise<Blob> => {
		const response = await instance.get(`${BASE_URL}/export`, {
			params,
			responseType: 'blob',
		});
		return response.data;
	},

	// Tính phạt tự động cho sách trả muộn
	calculateOverdueFine: async (
		borrowId: string
	): Promise<{ fine_amount: number; days_overdue: number }> => {
		const response = await instance.post(
			`${BASE_URL}/calculate-overdue/${borrowId}`
		);
		return response.data;
	},

	// Tạo phạt cho sách hư hỏng
	createDamageFine: async (
		borrowId: string,
		data: { fine_amount: number; reason: string }
	): Promise<Fine> => {
		const response = await instance.post(
			`${BASE_URL}/damage/${borrowId}`,
			data
		);
		return response.data;
	},

	// Tạo phạt cho sách mất
	createLostFine: async (
		borrowId: string,
		data: { fine_amount: number; reason: string }
	): Promise<Fine> => {
		const response = await instance.post(`${BASE_URL}/lost/${borrowId}`, data);
		return response.data;
	},
};
