import type {
	CardExpiryCheck,
	CreateReaderRequest,
	ExpiringSoonQuery,
	GeneratedCardNumber,
	PaginationReaderQuery,
	Reader,
	RenewCardRequest,
	SearchReaderQuery,
	UpdateReaderRequest,
} from '../types/readers';

import type { PaginatedResponse } from '../types';
import instance from '../configs/instances';

export const ReadersAPI = {
	// Get all readers with pagination
	getAll: async (
		params?: PaginationReaderQuery
	): Promise<PaginatedResponse<Reader>> => {
		const res = await instance.get('/api/readers', { params });
		return res.data;
	},

	// Search readers
	search: async (
		params: SearchReaderQuery
	): Promise<PaginatedResponse<Reader>> => {
		const res = await instance.get('/api/readers/search', { params });
		return res.data;
	},

	// Get expired cards
	getExpiredCards: async (
		params?: PaginationReaderQuery
	): Promise<PaginatedResponse<Reader>> => {
		const res = await instance.get('/api/readers/expired-cards', { params });
		return res.data;
	},

	// Get expiring soon cards
	getExpiringSoon: async (
		params: ExpiringSoonQuery
	): Promise<PaginatedResponse<Reader>> => {
		const res = await instance.get('/api/readers/expiring-soon', { params });
		return res.data;
	},

	// Generate new card number
	generateCardNumber: async (): Promise<GeneratedCardNumber> => {
		const res = await instance.get('/api/readers/generate-card-number');
		return res.data;
	},

	// Get readers by type
	getByType: async (
		readerTypeId: string,
		params?: PaginationReaderQuery
	): Promise<PaginatedResponse<Reader>> => {
		const res = await instance.get(`/api/readers/type/${readerTypeId}`, {
			params,
		});
		return res.data;
	},

	// Get reader by ID
	getById: async (id: string): Promise<Reader> => {
		const res = await instance.get(`/api/readers/${id}`);
		return res.data;
	},

	// Get reader by user ID
	getByUserId: async (userId: string): Promise<Reader> => {
		const res = await instance.get(`/api/readers/user/${userId}`);
		return res.data;
	},

	// Get reader by card number
	getByCardNumber: async (cardNumber: string): Promise<Reader> => {
		const res = await instance.get(`/api/readers/card/${cardNumber}`);
		return res.data;
	},

	// Create new reader
	create: async (data: CreateReaderRequest): Promise<Reader> => {
		const res = await instance.post('/api/readers', data);
		return res.data;
	},

	// Update reader by ID
	update: async (id: string, data: UpdateReaderRequest): Promise<Reader> => {
		const res = await instance.patch(`/api/readers/${id}`, data);
		return res.data;
	},

	// Activate reader card
	activate: async (id: string): Promise<Reader> => {
		const res = await instance.patch(`/api/readers/${id}/activate`);
		return res.data;
	},

	// Deactivate reader card
	deactivate: async (id: string): Promise<Reader> => {
		const res = await instance.patch(`/api/readers/${id}/deactivate`);
		return res.data;
	},

	// Check card expiry
	checkExpiry: async (id: string): Promise<CardExpiryCheck> => {
		const res = await instance.get(`/api/readers/${id}/check-expiry`);
		return res.data;
	},

	// Renew card
	renewCard: async (id: string, data: RenewCardRequest): Promise<Reader> => {
		const res = await instance.patch(`/api/readers/${id}/renew-card`, data);
		return res.data;
	},

	// Delete reader by ID
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/readers/${id}`);
	},
};
