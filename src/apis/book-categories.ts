import instance from '@/configs/instances';
import type {
	BookCategory,
	CreateBookCategoryRequest,
	PaginationBookCategoryQuery,
	SearchBookCategoryQuery,
	UpdateBookCategoryRequest,
} from '@/types/book-categories';
import type { PaginatedResponse } from '@/types/common';

export const BookCategoriesAPI = {
	getAll: async (
		params?: PaginationBookCategoryQuery
	): Promise<PaginatedResponse<BookCategory>> => {
		const res = await instance.get('/api/book-categories', { params });
		return res.data;
	},

	getAllNoPaginate: async (): Promise<BookCategory[]> => {
		const res = await instance.get('/api/book-categories/all');
		return res.data;
	},

	search: async (
		params: SearchBookCategoryQuery
	): Promise<PaginatedResponse<BookCategory>> => {
		const res = await instance.get('/api/book-categories/search', { params });
		return res.data;
	},

	getById: async (id: string): Promise<BookCategory> => {
		const res = await instance.get(`/api/book-categories/${id}`);
		return res.data;
	},

	create: async (data: CreateBookCategoryRequest): Promise<BookCategory> => {
		const res = await instance.post('/api/book-categories', data);
		return res.data;
	},

	update: async (
		id: string,
		data: UpdateBookCategoryRequest
	): Promise<BookCategory> => {
		const res = await instance.patch(`/api/book-categories/${id}`, data);
		return res.data;
	},

	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/book-categories/${id}`);
	},
};
