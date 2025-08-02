import type { BaseEntity, PaginatedResponse } from './common';

export interface EBook extends BaseEntity {
	book_id: string;
	file_path: string;
	file_size: number;
	file_format: string;
	download_count: number;
	book?: EBookBookInfo;
}

export interface EBookBookInfo {
	id: string;
	title: string;
	isbn: string;
	slug: string;
	cover_image?: string;
}

export interface CreateEBookRequest {
	book_id: string;
	file_path: string;
	file_size: number;
	file_format: string;
}

export interface UpdateEBookRequest {
	file_path?: string;
	file_size?: number;
	file_format?: string;
}

export interface UpdateEBookFileRequest {
	file_path: string;
	file_size: number;
	file_format: string;
}

export interface CreateManyEBooksRequest {
	ebooks: Omit<CreateEBookRequest, 'book_id'>[];
}

export interface EBookSearchQuery {
	q: string;
	page?: number;
	limit?: number;
}

export interface EBookFormatQuery {
	format: string;
	page?: number;
	limit?: number;
}

export interface EBookSizeRangeQuery {
	minSize: number;
	maxSize: number;
	page?: number;
	limit?: number;
}

export interface EBookDownloadsQuery {
	minDownloads: number;
	page?: number;
	limit?: number;
}

export interface EBookAuthorQuery {
	authorId: string;
	page?: number;
	limit?: number;
}

export interface EBookCategoryQuery {
	categoryId: string;
	page?: number;
	limit?: number;
}

export interface EBookBookQuery {
	bookId: string;
	page?: number;
	limit?: number;
}

export interface EBookStats {
	total: number;
	totalDownloads: number;
	totalSize: number;
	byFormat: Array<{
		format: string;
		count: number;
		totalSize: number;
	}>;
	popularEbooks: Array<{
		id: string;
		title: string;
		downloads: number;
	}>;
	recentUploads: Array<{
		id: string;
		title: string;
		uploadDate: string;
	}>;
}

export interface BatchDeleteRequest {
	ids: string[];
}

export type EBooksResponse = PaginatedResponse<EBook>;
export type EBookResponse = EBook;
export type BulkCreateEBooksResponse = EBook[];
export type EBookStatsResponse = EBookStats;
