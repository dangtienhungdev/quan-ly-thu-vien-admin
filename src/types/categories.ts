import type { PaginationQuery } from './common';

export type PaginationCategoryQuery = PaginationQuery;

export type Category = {
	id: string;
	category_name: string;
	slug: string;
	description?: string;
	parent_id?: string;
	parent?: {
		id: string;
		category_name: string;
	};
	children?: Array<{
		id: string;
		category_name: string;
	}>;
	created_at: string;
	updated_at: string;
};

export type CreateCategoryRequest = {
	category_name: string;
	description?: string;
	parent_id?: string;
};

export type UpdateCategoryRequest = {
	category_name?: string;
	description?: string;
	parent_id?: string;
};

export type SearchCategoryQuery = PaginationQuery & {
	q?: string;
};
