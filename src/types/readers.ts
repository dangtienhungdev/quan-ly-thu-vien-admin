import type { BaseEntity, PaginatedResponse } from './common';

export interface Reader extends BaseEntity {
	user_id: string;
	card_number: string;
	full_name: string;
	date_of_birth: string;
	gender: 'male' | 'female' | 'other';
	phone: string;
	email: string;
	address: string;
	reader_type_id: string;
	card_issue_date: string;
	card_expiry_date: string;
	is_active: boolean;
	reader_type?: ReaderType;
	user?: ReaderUser;
}

export interface CreateReaderRequest {
	user_id: string;
	full_name: string;
	date_of_birth: string;
	gender: 'male' | 'female' | 'other';
	phone: string;
	email: string;
	address: string;
	reader_type_id: string;
	card_issue_date?: string;
	card_expiry_date?: string;
	is_active?: boolean;
}

export interface UpdateReaderRequest {
	full_name?: string;
	date_of_birth?: string;
	gender?: 'male' | 'female' | 'other';
	phone?: string;
	email?: string;
	address?: string;
	reader_type_id?: string;
	card_issue_date?: string;
	card_expiry_date?: string;
	is_active?: boolean;
}

export interface ReaderSearchQuery {
	q: string;
	page?: number;
	limit?: number;
}

export interface ExpiringSoonQuery {
	days?: number;
	page?: number;
	limit?: number;
}

export interface ReaderByTypeQuery {
	readerTypeId: string;
	page?: number;
	limit?: number;
}

export interface GenerateCardNumberResponse {
	card_number: string;
}

export type ReadersResponse = PaginatedResponse<Reader>;
export type ReaderResponse = Reader;
export type ExpiredCardsResponse = PaginatedResponse<Reader>;
export type ExpiringSoonResponse = PaginatedResponse<Reader>;
export type ReadersByTypeResponse = PaginatedResponse<Reader>;

// Related types
export interface ReaderType {
	id: string;
	type_name: string;
	description?: string;
	max_books: number;
	max_days: number;
	fee_per_day: number;
}

export interface ReaderUser {
	id: string;
	username: string;
	email: string;
	role: 'admin' | 'user';
	accountStatus: 'active' | 'inactive' | 'banned';
}
