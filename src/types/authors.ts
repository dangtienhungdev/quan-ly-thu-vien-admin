import type { PaginationQuery } from './common';

export type PaginationAuthorQuery = PaginationQuery;

export type Author = {
	id: string;
	author_name: string;
	slug: string;
	bio?: string;
	nationality: string;
	created_at: string;
	updated_at: string;
};

export type CreateAuthorRequest = {
	author_name: string;
	bio?: string;
	nationality: string;
};

export type CreateManyAuthorsRequest = {
	authors: CreateAuthorRequest[];
};

export type UpdateAuthorRequest = {
	author_name?: string;
	bio?: string;
	nationality?: string;
};

export type SearchAuthorQuery = PaginationQuery & {
	q?: string;
};
