import type { PaginatedResponse, User } from '../types';

import type { PaginationUserQuery } from '@/types/user.type';
import instance from '../configs/instances';

export interface UploadExcelResponse {
	message: string;
	filename: string;
	size: number;
	totalRows: number;
	validRows: number;
	invalidRows: number;
	errors?: string[];
	data: any[];
}

export const UsersAPI = {
	// Get all users with pagination
	getAll: async (
		params?: PaginationUserQuery
	): Promise<PaginatedResponse<User>> => {
		const res = await instance.get('/api/users', { params });
		return res.data;
	},

	// Get user by ID
	getById: async (id: string): Promise<User> => {
		const res = await instance.get(`/api/users/${id}`);
		return res.data;
	},

	// Get current user profile
	getProfile: async (): Promise<User> => {
		const res = await instance.get('/api/users/me');
		return res.data;
	},

	// Update user profile
	updateProfile: async (data: Partial<User>): Promise<User> => {
		const res = await instance.patch('/api/users/profile', data);
		return res.data;
	},

	// Change password
	changePassword: async (data: {
		currentPassword: string;
		newPassword: string;
		confirmNewPassword: string;
	}): Promise<void> => {
		await instance.post('/api/auth/change-password', data);
	},

	// Create new user
	create: async (
		data: import('../types/user.type').CreateUserRequest
	): Promise<User> => {
		const res = await instance.post('/api/users', data);
		return res.data;
	},

	// Delete user by ID
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/users/${id}`);
	},

	// Update user by ID
	update: async (
		id: string,
		data: import('../types/user.type').UpdateUserRequest
	): Promise<User> => {
		const res = await instance.patch(`/api/users/${id}`, data);
		return res.data;
	},

	// get me
	getMe: async (): Promise<User> => {
		const res = await instance.get('/api/users/me');
		return res.data;
	},

	// Create multiple users
	createMultiple: async (data: { users: any[] }): Promise<any> => {
		const res = await instance.post('/api/users/bulk', data);
		return res.data;
	},

	// Upload Excel
	uploadExcel: async (file: File): Promise<UploadExcelResponse> => {
		const formData = new FormData();
		formData.append('file', file);

		const res = await instance.post('/api/users/upload-excel', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return res.data;
	},

	// Create users from Excel data
	createUsersFromExcel: async (excelData: any[]): Promise<any> => {
		const res = await instance.post('/api/users/create-from-excel', {
			excelData,
		});
		return res.data;
	},

	// Sync userCode to cardNumber
	syncUserCodeToCardNumber: async (): Promise<any> => {
		const res = await instance.post('/api/users/sync-usercode-to-cardnumber');
		return res.data;
	},

	// Create reader for user
	createReaderForUser: async (
		userId: string,
		readerData: any
	): Promise<any> => {
		const res = await instance.post(`/api/users/${userId}/reader`, readerData);
		return res.data;
	},

	// Get reader types
	getReaderTypes: async (): Promise<any> => {
		const res = await instance.get('/api/reader-types');
		return res.data;
	},
};
