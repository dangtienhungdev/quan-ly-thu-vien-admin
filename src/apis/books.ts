import type {
	BookByIsbnQuery,
	BookResponse,
	BookSearchQuery,
	BooksResponse,
	BulkCreateBookResponse,
	CreateBookRequest,
	PaginationQuery,
	UpdateBookRequest,
} from '../types';

import instance from '../configs/instances';

export const BooksAPI = {
	// Get all books with pagination
	getAll: async (params?: PaginationQuery): Promise<BooksResponse> => {
		const res = await instance.get('/books', { params });
		return res.data;
	},

	// Get book by ID
	getById: async (id: string): Promise<BookResponse> => {
		const res = await instance.get(`/books/${id}`);
		return res.data;
	},

	// Get book by slug
	getBySlug: async (slug: string): Promise<BookResponse> => {
		const res = await instance.get(`/books/slug/${slug}`);
		return res.data;
	},

	// Get book by ISBN
	getByIsbn: async (params: BookByIsbnQuery): Promise<BookResponse> => {
		const res = await instance.get(`/books/isbn/${params.isbn}`);
		return res.data;
	},

	// Create a new book
	create: async (data: CreateBookRequest): Promise<BookResponse> => {
		const res = await instance.post('/books', data);
		return res.data;
	},

	// Create multiple books
	createBulk: async (
		data: CreateBookRequest[]
	): Promise<BulkCreateBookResponse> => {
		const res = await instance.post('/books/bulk', data);
		return res.data;
	},

	// Update book by ID
	update: async (
		id: string,
		data: UpdateBookRequest
	): Promise<BookResponse> => {
		const res = await instance.patch(`/books/${id}`, data);
		return res.data;
	},

	// Update book by slug
	updateBySlug: async (
		slug: string,
		data: UpdateBookRequest
	): Promise<BookResponse> => {
		const res = await instance.patch(`/books/slug/${slug}`, data);
		return res.data;
	},

	// Delete book by ID
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/books/${id}`);
	},

	// Delete book by slug
	deleteBySlug: async (slug: string): Promise<void> => {
		await instance.delete(`/books/slug/${slug}`);
	},

	// Search books
	search: async (params: BookSearchQuery): Promise<BooksResponse> => {
		const res = await instance.get('/books/search', { params });
		return res.data;
	},
};
