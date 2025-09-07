import type { PaginationQuery } from './common';

export type PaginationBookCategoryQuery = PaginationQuery;

export type BookCategory = {
	id: string;
	name: string;
	parent_id?: string | null;
	parent?: { id: string; name: string } | null;
	children?: Array<{ id: string; name: string }>;
	createdAt: string;
	updated_at: string;
};

export type CreateBookCategoryRequest = {
	name: string;
	parent_id?: string | null;
};

export type UpdateBookCategoryRequest = {
	name?: string;
	parent_id?: string | null;
};

export type SearchBookCategoryQuery = PaginationBookCategoryQuery & {
	q?: string;
};
