export type { PaginationQuery } from './common';
export type PaginationGradeLevelQuery = import('./common').PaginationQuery;

export type GradeLevel = {
	id: string;
	name: string;
	description?: string;
	order: number;
	created_at: string;
	updated_at: string;
};

export type CreateGradeLevelRequest = {
	name: string;
	description?: string;
	order?: number;
};

export type UpdateGradeLevelRequest = {
	name?: string;
	description?: string;
	order?: number;
};

export type SearchGradeLevelQuery = PaginationGradeLevelQuery & {
	q?: string;
};
