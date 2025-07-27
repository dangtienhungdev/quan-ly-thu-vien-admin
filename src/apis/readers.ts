import type {
	CreateReaderRequest,
	ExpiredCardsResponse,
	ExpiringSoonQuery,
	ExpiringSoonResponse,
	GenerateCardNumberResponse,
	PaginationQuery,
	ReaderByTypeQuery,
	ReaderResponse,
	ReaderSearchQuery,
	ReadersByTypeResponse,
	ReadersResponse,
	UpdateReaderRequest,
} from '../types';

import instance from '../configs/instances';

export const ReadersAPI = {
	// Get all readers with pagination
	getAll: async (params?: PaginationQuery): Promise<ReadersResponse> => {
		const res = await instance.get('/readers', { params });
		return res.data;
	},

	// Get reader by ID
	getById: async (id: string): Promise<ReaderResponse> => {
		const res = await instance.get(`/readers/${id}`);
		return res.data;
	},

	// Get reader by user ID
	getByUserId: async (userId: string): Promise<ReaderResponse> => {
		const res = await instance.get(`/readers/user/${userId}`);
		return res.data;
	},

	// Get reader by card number
	getByCardNumber: async (cardNumber: string): Promise<ReaderResponse> => {
		const res = await instance.get(`/readers/card/${cardNumber}`);
		return res.data;
	},

	// Create a new reader
	create: async (data: CreateReaderRequest): Promise<ReaderResponse> => {
		const res = await instance.post('/readers', data);
		return res.data;
	},

	// Update reader by ID
	update: async (
		id: string,
		data: UpdateReaderRequest
	): Promise<ReaderResponse> => {
		const res = await instance.patch(`/readers/${id}`, data);
		return res.data;
	},

	// Update reader by user ID
	updateByUserId: async (
		userId: string,
		data: UpdateReaderRequest
	): Promise<ReaderResponse> => {
		const res = await instance.patch(`/readers/user/${userId}`, data);
		return res.data;
	},

	// Update reader by card number
	updateByCardNumber: async (
		cardNumber: string,
		data: UpdateReaderRequest
	): Promise<ReaderResponse> => {
		const res = await instance.patch(`/readers/card/${cardNumber}`, data);
		return res.data;
	},

	// Delete reader by ID
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/readers/${id}`);
	},

	// Delete reader by user ID
	deleteByUserId: async (userId: string): Promise<void> => {
		await instance.delete(`/readers/user/${userId}`);
	},

	// Delete reader by card number
	deleteByCardNumber: async (cardNumber: string): Promise<void> => {
		await instance.delete(`/readers/card/${cardNumber}`);
	},

	// Search readers
	search: async (params: ReaderSearchQuery): Promise<ReadersResponse> => {
		const res = await instance.get('/readers/search', { params });
		return res.data;
	},

	// Get expired cards
	getExpiredCards: async (
		params?: PaginationQuery
	): Promise<ExpiredCardsResponse> => {
		const res = await instance.get('/readers/expired-cards', { params });
		return res.data;
	},

	// Get expiring soon cards
	getExpiringSoon: async (
		params: ExpiringSoonQuery
	): Promise<ExpiringSoonResponse> => {
		const res = await instance.get('/readers/expiring-soon', { params });
		return res.data;
	},

	// Generate new card number
	generateCardNumber: async (): Promise<GenerateCardNumberResponse> => {
		const res = await instance.get('/readers/generate-card-number');
		return res.data;
	},

	// Get readers by type
	getByType: async (
		params: ReaderByTypeQuery
	): Promise<ReadersByTypeResponse> => {
		const res = await instance.get(`/readers/type/${params.readerTypeId}`, {
			params: { page: params.page, limit: params.limit },
		});
		return res.data;
	},
};
