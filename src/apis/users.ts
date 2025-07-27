import type { PaginatedResponse, User } from '../types';

import type { PaginationUserQuery } from '@/types/user.type';
import instance from '../configs/instances';

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
		const res = await instance.get('/api/auth/me');
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
};
