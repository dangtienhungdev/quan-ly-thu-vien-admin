import type { BaseEntity, PaginatedResponse } from './common';

export interface Publisher extends BaseEntity {
	publisher_name: string;
	slug: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
	description?: string;
	country: string;
	established_date?: string;
	is_active: boolean;
}

export interface CreatePublisherRequest {
	publisher_name: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
	description?: string;
	country: string;
	established_date?: string;
	is_active?: boolean;
}

export interface UpdatePublisherRequest {
	publisher_name?: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
	description?: string;
	country?: string;
	established_date?: string;
	is_active?: boolean;
}

export interface BulkCreatePublisherRequest {
	publishers: CreatePublisherRequest[];
}

export interface BulkCreatePublisherError {
	index: number;
	publisher_name: string;
	error: string;
}

export interface BulkCreatePublisherSummary {
	total: number;
	success: number;
	failed: number;
}

export interface BulkCreatePublisherResponse {
	success: Publisher[];
	errors: BulkCreatePublisherError[];
	summary: BulkCreatePublisherSummary;
}

export interface PublisherSearchQuery {
	q: string;
	page?: number;
	limit?: number;
}

export type PublishersResponse = PaginatedResponse<Publisher>;
export type PublisherResponse = Publisher;
