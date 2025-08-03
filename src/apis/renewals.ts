import { apiClient } from '@/lib/api-client';
import type {
	CreateRenewalRequest,
	PaginatedResponse,
	PaginationRenewalQuery,
	Renewal,
	RenewalStatistics,
	RenewalValidationResult,
	RenewalWithBorrowDetails,
	UpdateRenewalRequest,
} from '@/types';

const BASE_URL = '/renewals';

export const renewalsApi = {
	// Tạo gia hạn mới
	create: async (data: CreateRenewalRequest): Promise<Renewal> => {
		const response = await apiClient.post(BASE_URL, data);
		return response.data;
	},

	// Lấy danh sách gia hạn có phân trang
	getAll: async (
		params?: PaginationRenewalQuery
	): Promise<PaginatedResponse<RenewalWithBorrowDetails>> => {
		const response = await apiClient.get(BASE_URL, { params });
		return response.data;
	},

	// Tìm kiếm gia hạn
	search: async (
		query: string,
		params?: PaginationRenewalQuery
	): Promise<PaginatedResponse<RenewalWithBorrowDetails>> => {
		const response = await apiClient.get(`${BASE_URL}/search`, {
			params: { q: query, ...params },
		});
		return response.data;
	},

	// Lọc theo độc giả
	getByReader: async (
		readerId: string,
		params?: PaginationRenewalQuery
	): Promise<PaginatedResponse<RenewalWithBorrowDetails>> => {
		const response = await apiClient.get(`${BASE_URL}/reader/${readerId}`, {
			params,
		});
		return response.data;
	},

	// Lọc theo sách
	getByBook: async (
		bookId: string,
		params?: PaginationRenewalQuery
	): Promise<PaginatedResponse<RenewalWithBorrowDetails>> => {
		const response = await apiClient.get(`${BASE_URL}/book/${bookId}`, {
			params,
		});
		return response.data;
	},

	// Lọc theo thủ thư
	getByLibrarian: async (
		librarianId: string,
		params?: PaginationRenewalQuery
	): Promise<PaginatedResponse<RenewalWithBorrowDetails>> => {
		const response = await apiClient.get(
			`${BASE_URL}/librarian/${librarianId}`,
			{ params }
		);
		return response.data;
	},

	// Lọc theo khoảng thời gian
	getByDateRange: async (
		startDate: string,
		endDate: string,
		params?: PaginationRenewalQuery
	): Promise<PaginatedResponse<RenewalWithBorrowDetails>> => {
		const response = await apiClient.get(`${BASE_URL}/date-range`, {
			params: { start_date: startDate, end_date: endDate, ...params },
		});
		return response.data;
	},

	// Gia hạn gần đây
	getRecent: async (
		limit: number = 10
	): Promise<RenewalWithBorrowDetails[]> => {
		const response = await apiClient.get(`${BASE_URL}/recent`, {
			params: { limit },
		});
		return response.data;
	},

	// Thống kê gia hạn
	getStatistics: async (): Promise<RenewalStatistics> => {
		const response = await apiClient.get(`${BASE_URL}/stats`);
		return response.data;
	},

	// Lấy chi tiết gia hạn
	getById: async (id: string): Promise<RenewalWithBorrowDetails> => {
		const response = await apiClient.get(`${BASE_URL}/${id}`);
		return response.data;
	},

	// Cập nhật gia hạn
	update: async (id: string, data: UpdateRenewalRequest): Promise<Renewal> => {
		const response = await apiClient.patch(`${BASE_URL}/${id}`, data);
		return response.data;
	},

	// Xóa gia hạn
	delete: async (id: string): Promise<void> => {
		await apiClient.delete(`${BASE_URL}/${id}`);
	},

	// Xóa nhiều gia hạn
	deleteBatch: async (ids: string[]): Promise<void> => {
		await apiClient.delete(`${BASE_URL}/batch`, { data: { ids } });
	},

	// Kiểm tra có thể gia hạn không
	validateRenewal: async (
		borrowId: string
	): Promise<RenewalValidationResult> => {
		const response = await apiClient.get(`${BASE_URL}/validate/${borrowId}`);
		return response.data;
	},

	// Gia hạn tự động (tính toán ngày hết hạn mới)
	autoRenew: async (borrowId: string): Promise<Renewal> => {
		const response = await apiClient.post(`${BASE_URL}/auto-renew/${borrowId}`);
		return response.data;
	},

	// Xuất báo cáo gia hạn
	exportReport: async (params?: PaginationRenewalQuery): Promise<Blob> => {
		const response = await apiClient.get(`${BASE_URL}/export`, {
			params,
			responseType: 'blob',
		});
		return response.data;
	},

	// Lấy lịch sử gia hạn của một lần mượn
	getByBorrowRecord: async (
		borrowId: string
	): Promise<RenewalWithBorrowDetails[]> => {
		const response = await apiClient.get(`${BASE_URL}/borrow/${borrowId}`);
		return response.data;
	},

	// Gia hạn nhiều sách cùng lúc
	bulkRenew: async (borrowIds: string[]): Promise<Renewal[]> => {
		const response = await apiClient.post(`${BASE_URL}/bulk`, {
			borrow_ids: borrowIds,
		});
		return response.data;
	},
};
