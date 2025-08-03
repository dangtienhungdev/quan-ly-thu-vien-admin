import { apiClient } from '@/lib/api-client';
import type { ChartData, DashboardFilters, DashboardStatistics } from '@/types';

const BASE_URL = '/dashboard';

export const dashboardApi = {
	// Lấy thống kê tổng quan
	getStatistics: async (
		filters?: DashboardFilters
	): Promise<DashboardStatistics> => {
		const response = await apiClient.get(BASE_URL, { params: filters });
		return response.data;
	},

	// Lấy thống kê tổng quan
	getOverview: async (): Promise<DashboardStatistics['overview']> => {
		const response = await apiClient.get(`${BASE_URL}/overview`);
		return response.data;
	},

	// Lấy thống kê sách
	getBooksStats: async (): Promise<DashboardStatistics['books']> => {
		const response = await apiClient.get(`${BASE_URL}/books`);
		return response.data;
	},

	// Lấy thống kê độc giả
	getReadersStats: async (): Promise<DashboardStatistics['readers']> => {
		const response = await apiClient.get(`${BASE_URL}/readers`);
		return response.data;
	},

	// Lấy thống kê mượn trả
	getBorrowsStats: async (): Promise<DashboardStatistics['borrows']> => {
		const response = await apiClient.get(`${BASE_URL}/borrows`);
		return response.data;
	},

	// Lấy thống kê phạt
	getFinesStats: async (): Promise<DashboardStatistics['fines']> => {
		const response = await apiClient.get(`${BASE_URL}/fines`);
		return response.data;
	},

	// Lấy thống kê xu hướng
	getTrends: async (
		period: 'daily' | 'weekly' | 'monthly' = 'daily'
	): Promise<DashboardStatistics['trends']> => {
		const response = await apiClient.get(`${BASE_URL}/trends`, {
			params: { period },
		});
		return response.data;
	},

	// Lấy thống kê lưu trữ
	getStorageStats: async (): Promise<DashboardStatistics['storage']> => {
		const response = await apiClient.get(`${BASE_URL}/storage`);
		return response.data;
	},

	// Lấy cảnh báo
	getAlerts: async (): Promise<DashboardStatistics['alerts']> => {
		const response = await apiClient.get(`${BASE_URL}/alerts`);
		return response.data;
	},

	// Lấy dữ liệu biểu đồ mượn sách
	getBorrowChartData: async (
		period: 'daily' | 'weekly' | 'monthly' = 'daily'
	): Promise<ChartData> => {
		const response = await apiClient.get(`${BASE_URL}/charts/borrows`, {
			params: { period },
		});
		return response.data;
	},

	// Lấy dữ liệu biểu đồ trả sách
	getReturnChartData: async (
		period: 'daily' | 'weekly' | 'monthly' = 'daily'
	): Promise<ChartData> => {
		const response = await apiClient.get(`${BASE_URL}/charts/returns`, {
			params: { period },
		});
		return response.data;
	},

	// Lấy dữ liệu biểu đồ phạt
	getFinesChartData: async (
		period: 'daily' | 'weekly' | 'monthly' = 'daily'
	): Promise<ChartData> => {
		const response = await apiClient.get(`${BASE_URL}/charts/fines`, {
			params: { period },
		});
		return response.data;
	},

	// Lấy dữ liệu biểu đồ độc giả theo loại
	getReadersByTypeChartData: async (): Promise<ChartData> => {
		const response = await apiClient.get(`${BASE_URL}/charts/readers-by-type`);
		return response.data;
	},

	// Lấy dữ liệu biểu đồ sách theo thể loại
	getBooksByCategoryChartData: async (): Promise<ChartData> => {
		const response = await apiClient.get(
			`${BASE_URL}/charts/books-by-category`
		);
		return response.data;
	},

	// Lấy dữ liệu biểu đồ sách theo trạng thái
	getBooksByStatusChartData: async (): Promise<ChartData> => {
		const response = await apiClient.get(`${BASE_URL}/charts/books-by-status`);
		return response.data;
	},

	// Lấy báo cáo nhanh
	getQuickReport: async (): Promise<{
		totalBorrowsToday: number;
		totalReturnsToday: number;
		totalFinesToday: number;
		overdueBooksCount: number;
		newReadersToday: number;
		newBooksToday: number;
	}> => {
		const response = await apiClient.get(`${BASE_URL}/quick-report`);
		return response.data;
	},

	// Lấy thống kê theo thời gian thực
	getRealTimeStats: async (): Promise<{
		activeBorrows: number;
		overdueBooks: number;
		availableCopies: number;
		onlineReaders: number;
	}> => {
		const response = await apiClient.get(`${BASE_URL}/real-time`);
		return response.data;
	},

	// Xuất báo cáo dashboard
	exportReport: async (filters?: DashboardFilters): Promise<Blob> => {
		const response = await apiClient.get(`${BASE_URL}/export`, {
			params: filters,
			responseType: 'blob',
		});
		return response.data;
	},
};
