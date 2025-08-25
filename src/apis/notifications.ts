import type {
	NearDueBook,
	NearDueStats,
	NotificationFilters,
	NotificationResponse,
	NotificationStats,
	SendReminderRequest,
	SendReminderResponse,
} from '@/types/notifications';

import instance from '@/configs/instances';

export const NotificationsAPI = {
	// ===== NEAR DUE BOOKS =====

	// Lấy danh sách sách gần đến hạn
	getNearDueBooks: async (params: {
		page?: number;
		limit?: number;
		daysBeforeDue?: number;
	}): Promise<{
		data: NearDueBook[];
		meta: {
			page: number;
			limit: number;
			totalItems: number;
			totalPages: number;
		};
	}> => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.limit) queryParams.append('limit', params.limit.toString());
		if (params.daysBeforeDue)
			queryParams.append('daysBeforeDue', params.daysBeforeDue.toString());

		const response = await instance.get(
			`/api/borrow-records/near-due?${queryParams.toString()}`
		);
		return response.data;
	},

	// Lấy thống kê sách gần đến hạn
	getNearDueStats: async (params: {
		daysBeforeDue?: number;
	}): Promise<NearDueStats> => {
		const queryParams = new URLSearchParams();
		if (params.daysBeforeDue)
			queryParams.append('daysBeforeDue', params.daysBeforeDue.toString());

		const response = await instance.get(
			`/api/borrow-records/stats/near-due?${queryParams.toString()}`
		);
		return response.data;
	},

	// ===== SEND REMINDERS =====

	// Gửi thông báo nhắc nhở
	sendReminders: async (
		data: SendReminderRequest
	): Promise<SendReminderResponse> => {
		const response = await instance.post(
			'/api/borrow-records/send-reminders',
			data
		);
		return response.data;
	},

	// ===== NOTIFICATIONS MANAGEMENT =====

	// Lấy danh sách tất cả thông báo (Admin)
	getAllNotifications: async (
		filters?: NotificationFilters
	): Promise<NotificationResponse> => {
		const queryParams = new URLSearchParams();
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					queryParams.append(key, value.toString());
				}
			});
		}

		const response = await instance.get(
			`/api/notifications?${queryParams.toString()}`
		);
		return response.data;
	},

	// Lấy thống kê thông báo
	getNotificationStats: async (): Promise<NotificationStats> => {
		const response = await instance.get('/api/notifications/stats');
		return response.data;
	},

	// Lấy thống kê thông báo của độc giả
	getReaderNotificationStats: async (
		readerId: string
	): Promise<NotificationStats> => {
		const response = await instance.get(
			`/api/notifications/reader/${readerId}/stats`
		);
		return response.data;
	},

	// Xóa thông báo
	deleteNotification: async (notificationId: string): Promise<void> => {
		await instance.delete(`/api/notifications/${notificationId}`);
	},

	// Xóa tất cả thông báo của độc giả
	clearReaderNotifications: async (readerId: string): Promise<void> => {
		await instance.delete(`/api/notifications/reader/${readerId}/clear-all`);
	},
};
