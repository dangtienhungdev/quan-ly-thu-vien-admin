import type { PaginationQuery } from './common';

export type PaginationPublisherQuery = PaginationQuery;

export type Publisher = {
	id: string;
	publisherName: string;
	slug: string;
	address: string;
	phone: string;
	email: string;
	website?: string;
	description?: string;
	country?: string;
	establishedDate?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
};

export type CreatePublisherRequest = {
	publisherName: string;
	address: string;
	phone: string;
	email: string;
	website?: string;
	description?: string;
	country?: string;
	establishedDate?: string;
	isActive?: boolean;
};

export type CreateManyPublishersRequest = {
	publishers: CreatePublisherRequest[];
};

export type UpdatePublisherRequest = {
	publisherName?: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
	description?: string;
	country?: string;
	establishedDate?: string;
	isActive?: boolean;
};

export type SearchPublisherQuery = PaginationQuery & {
	q?: string;
};

export type PublisherStats = {
	total: number;
	active: number;
	inactive: number;
	byCountry: Array<{
		country: string;
		count: number;
	}>;
};

export type BulkCreateResult = {
	success: Publisher[];
	errors: Array<{
		index: number;
		publisherName: string;
		error: string;
	}>;
	summary: {
		total: number;
		success: number;
		failed: number;
	};
};
