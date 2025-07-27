import type { BaseEntity, PaginatedResponse } from './common';

export interface Author extends BaseEntity {
	author_name: string;
	slug: string;
	bio?: string;
	nationality: string;
}

export interface CreateAuthorRequest {
	author_name: string;
	bio?: string;
	nationality: string;
}

export interface UpdateAuthorRequest {
	author_name?: string;
	bio?: string;
	nationality?: string;
}

export interface BulkCreateAuthorRequest {
	authors: CreateAuthorRequest[];
}

export interface AuthorSearchQuery {
	q: string;
	page?: number;
	limit?: number;
}

export interface AuthorByNationalityQuery {
	nationality: string;
	page?: number;
	limit?: number;
}

export type AuthorsResponse = PaginatedResponse<Author>;
export type AuthorResponse = Author;
export type BulkCreateAuthorResponse = Author[];
