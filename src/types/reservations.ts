import type { BaseEntity, PaginatedResponse } from './common';

export type ReservationStatus =
	| 'pending'
	| 'fulfilled'
	| 'cancelled'
	| 'expired';

export interface Reservation extends BaseEntity {
	reader_id: string;
	reader: {
		id: string;
		user: null;
		readerType: null;
		fullName: string;
		dob: string;
		gender: string;
		address: string;
		phone: string;
		cardNumber: string;
		cardIssueDate: string;
		cardExpiryDate: string;
		isActive: boolean;
		createdAt: string;
		updatedAt: string;
	};
	book_id: string;
	book: {
		id: string;
		title: string;
		slug: string;
		isbn: string;
		publish_year: number;
		edition: string;
		description: string;
		cover_image: string;
		language: string;
		page_count: number;
		book_type: string;
		physical_type: string;
		publisher_id: string;
		category_id: string;
		main_category_id: null;
		created_at: string;
		view: number;
		updated_at: string;
	};
	physical_copy_id: string;
	physicalCopy: {
		id: string;
		book_id: string;
		barcode: string;
		status: string;
		current_condition: string;
		condition_details: string;
		purchase_date: string;
		purchase_price: string;
		location: string;
		notes: string;
		last_checkup_date: string;
		is_archived: boolean;
		created_at: string;
		updated_at: string;
	};
	reservation_date: string;
	expiry_date: string;
	status: ReservationStatus;
	reader_notes: string;
	librarian_notes: null;
	fulfillment_date: null;
	fulfilled_by: null;
	cancelled_date: null;
	cancellation_reason: null;
	cancelled_by: null;
	priority: number;
	created_at: string;
	updated_at: string;
}

// Type cho response của API expiring-soon
export interface ReservationExpiringSoonItem {
	id: string;
	reader_id: string;
	reader: {
		id: string;
		user: null;
		readerType: null;
		fullName: string;
		dob: string;
		gender: string;
		address: string;
		phone: string;
		cardNumber: string;
		cardIssueDate: string;
		cardExpiryDate: string;
		isActive: boolean;
		createdAt: string;
		updatedAt: string;
	};
	book_id: string;
	book: {
		id: string;
		title: string;
		slug: string;
		isbn: string;
		publish_year: number;
		edition: string;
		description: string;
		cover_image: string;
		language: string;
		page_count: number;
		book_type: string;
		physical_type: string;
		publisher_id: string;
		category_id: string;
		main_category_id: null;
		created_at: string;
		view: number;
		updated_at: string;
	};
	reservation_date: string;
	expiry_date: string;
	status: ReservationStatus;
	reader_notes: string;
	librarian_notes: null;
	fulfillment_date: null;
	fulfilled_by: null;
	cancelled_date: null;
	cancellation_reason: null;
	cancelled_by: null;
	priority: number;
	created_at: string;
	updated_at: string;
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
	reservation_date: string;
	expiry_date: string;
	reader_notes?: string;
	priority?: number;
}

export interface CreateMultipleReservationsRequest {
	reservations: CreateReservationRequest[];
}

export interface BulkReservationResult {
	index: number;
	error: string;
	data: CreateReservationRequest;
}

export interface BulkReservationsResponse {
	created: Reservation[];
	failed: BulkReservationResult[];
	total: number;
	successCount: number;
	failureCount: number;
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
export type ReservationExpiringSoonResponse = ReservationExpiringSoonItem[];

export type ReservationsStatsByStatusResponse = {
	total: number;
	byStatus: { status: string; count: number }[];
	pending: number;
	fulfilled: number;
	cancelled: number;
	expired: number;
	expiringSoon: number;
};
