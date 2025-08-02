import type {
	BatchDeleteRequest,
	BulkCreateEBooksResponse,
	CreateEBookRequest,
	CreateManyEBooksRequest,
	EBookAuthorQuery,
	EBookBookQuery,
	EBookCategoryQuery,
	EBookDownloadsQuery,
	EBookFormatQuery,
	EBookResponse,
	EBookSearchQuery,
	EBookSizeRangeQuery,
	EBookStatsResponse,
	EBooksResponse,
	UpdateEBookFileRequest,
	UpdateEBookRequest,
} from '../types';

import instance from '../configs/instances';

export const EBooksAPI = {
	// Create a new ebook
	create: async (data: CreateEBookRequest): Promise<EBookResponse> => {
		const res = await instance.post('/api/ebooks', data);
		return res.data;
	},

	// Create multiple ebooks for a book
	createMany: async (
		bookId: string,
		data: CreateManyEBooksRequest
	): Promise<BulkCreateEBooksResponse> => {
		const res = await instance.post(`/api/ebooks/book/${bookId}/many`, data);
		return res.data;
	},

	// Get all ebooks with pagination
	getAll: async (params?: {
		page?: number;
		limit?: number;
	}): Promise<EBooksResponse> => {
		const res = await instance.get('/api/ebooks', { params });
		return res.data;
	},

	// Search ebooks
	search: async (params: EBookSearchQuery): Promise<EBooksResponse> => {
		const res = await instance.get('/api/ebooks/search', { params });
		return res.data;
	},

	// Get ebooks by format
	getByFormat: async (params: EBookFormatQuery): Promise<EBooksResponse> => {
		const res = await instance.get(`/api/ebooks/format/${params.format}`, {
			params,
		});
		return res.data;
	},

	// Get ebooks by size range
	getBySizeRange: async (
		params: EBookSizeRangeQuery
	): Promise<EBooksResponse> => {
		const res = await instance.get('/api/ebooks/size-range', { params });
		return res.data;
	},

	// Get popular ebooks
	getPopular: async (limit?: number): Promise<EBookResponse[]> => {
		const res = await instance.get('/api/ebooks/popular', {
			params: { limit },
		});
		return res.data;
	},

	// Get recent ebooks
	getRecent: async (limit?: number): Promise<EBookResponse[]> => {
		const res = await instance.get('/api/ebooks/recent', { params: { limit } });
		return res.data;
	},

	// Get ebooks by download count
	getByDownloads: async (
		params: EBookDownloadsQuery
	): Promise<EBooksResponse> => {
		const res = await instance.get(
			`/api/ebooks/downloads/${params.minDownloads}`,
			{ params }
		);
		return res.data;
	},

	// Get ebooks by author
	getByAuthor: async (params: EBookAuthorQuery): Promise<EBooksResponse> => {
		const res = await instance.get(`/api/ebooks/author/${params.authorId}`, {
			params,
		});
		return res.data;
	},

	// Get ebooks by category
	getByCategory: async (
		params: EBookCategoryQuery
	): Promise<EBooksResponse> => {
		const res = await instance.get(
			`/api/ebooks/category/${params.categoryId}`,
			{ params }
		);
		return res.data;
	},

	// Get ebooks by book
	getByBook: async (params: EBookBookQuery): Promise<EBooksResponse> => {
		const res = await instance.get(`/api/ebooks/book/${params.bookId}`, {
			params,
		});
		return res.data;
	},

	// Get ebook statistics
	getStats: async (): Promise<EBookStatsResponse> => {
		const res = await instance.get('/api/ebooks/stats');
		return res.data;
	},

	// Get ebook by ID
	getById: async (id: string): Promise<EBookResponse> => {
		const res = await instance.get(`/api/ebooks/${id}`);
		return res.data;
	},

	// Update ebook
	update: async (
		id: string,
		data: UpdateEBookRequest
	): Promise<EBookResponse> => {
		const res = await instance.patch(`/api/ebooks/${id}`, data);
		return res.data;
	},

	// Update ebook file info
	updateFileInfo: async (
		id: string,
		data: UpdateEBookFileRequest
	): Promise<EBookResponse> => {
		const res = await instance.patch(`/api/ebooks/${id}/file-info`, data);
		return res.data;
	},

	// Increment download count
	incrementDownloads: async (id: string): Promise<EBookResponse> => {
		const res = await instance.post(`/api/ebooks/${id}/increment-downloads`);
		return res.data;
	},

	// Delete ebook
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/ebooks/${id}`);
	},

	// Delete multiple ebooks
	deleteBatch: async (data: BatchDeleteRequest): Promise<void> => {
		await instance.delete('/api/ebooks/batch', { data });
	},
};
