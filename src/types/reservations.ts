import type { BaseEntity, PaginatedResponse } from './common';

export type ReservationStatus =
	| 'pending'
	| 'fulfilled'
	| 'cancelled'
	| 'expired';

export interface Reservation extends BaseEntity {
	reader_id: string;
	book_id: string;
	reservation_date: string;
	expiry_date: string;
	status: ReservationStatus;
	reader?: ReservationReaderInfo;
	book?: ReservationBookInfo;
}

export interface ReservationReaderInfo {
	id: string;
	full_name: string;
	card_number: string;
	email?: string;
	phone?: string;
}

export interface ReservationBookInfo {
	id: string;
	title: string;
	isbn: string;
	slug: string;
	cover_image?: string;
	authors?: Array<{
		id: string;
		author_name: string;
	}>;
}

export interface CreateReservationRequest {
	reader_id: string;
	book_id: string;
	reservation_date?: string;
	expiry_date?: string;
}

export interface UpdateReservationRequest {
	reservation_date?: string;
	expiry_date?: string;
	status?: ReservationStatus;
}

export interface ReservationSearchQuery {
	q: string;
	page?: number;
	limit?: number;
}

export interface ReservationStatusQuery {
	status: ReservationStatus;
	page?: number;
	limit?: number;
}

export interface ReservationReaderQuery {
	readerId: string;
	page?: number;
	limit?: number;
}

export interface ReservationBookQuery {
	bookId: string;
	page?: number;
	limit?: number;
}

export interface ReservationDateRangeQuery {
	startDate: string;
	endDate: string;
	page?: number;
	limit?: number;
}

export interface ReservationExpiringSoonQuery {
	days: number;
	page?: number;
	limit?: number;
}

export interface ReservationStats {
	total: number;
	pending: number;
	fulfilled: number;
	cancelled: number;
	expired: number;
	byStatus: Array<{
		status: ReservationStatus;
		count: number;
	}>;
	byReaderType: Array<{
		type: string;
		count: number;
	}>;
	byMonth: Array<{
		month: string;
		count: number;
	}>;
	expiringSoon: Array<{
		id: string;
		reader_name: string;
		book_title: string;
		days_until_expiry: number;
	}>;
	popularBooks: Array<{
		book_id: string;
		book_title: string;
		reservation_count: number;
	}>;
}

export type ReservationsResponse = PaginatedResponse<Reservation>;
export type ReservationResponse = Reservation;
export type ReservationStatsResponse = ReservationStats;
