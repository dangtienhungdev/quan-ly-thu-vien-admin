import type { BaseEntity, PaginatedResponse } from './common';

export type BorrowStatus = 'borrowed' | 'returned' | 'overdue' | 'renewed';

export interface BorrowRecord extends BaseEntity {
	reader_id: string;
	copy_id: string;
	borrow_date: string;
	due_date: string;
	return_date?: string;
	status: BorrowStatus;
	librarian_id: string;
	reader?: BorrowRecordReaderInfo;
	copy?: CopyInfo;
	librarian?: LibrarianInfo;
	renewals?: RenewalInfo[];
	fines?: FineInfo[];
}

export interface BorrowRecordReaderInfo {
	id: string;
	full_name: string;
	card_number: string;
	reader_type?: {
		type_name: string;
		max_borrow_limit: number;
		borrow_duration_days: number;
	};
}

export interface CopyInfo {
	id: string;
	barcode: string;
	status: string;
	current_condition: string;
	location: string;
	book?: {
		id: string;
		title: string;
		isbn: string;
		cover_image?: string;
	};
}

export interface LibrarianInfo {
	id: string;
	username: string;
	email: string;
}

export interface RenewalInfo {
	id: string;
	renewal_date: string;
	new_due_date: string;
	librarian_id: string;
}

export interface FineInfo {
	id: string;
	fine_amount: number;
	fine_date: string;
	reason: string;
	status: 'unpaid' | 'paid';
	payment_date?: string;
}

export interface CreateBorrowRecordRequest {
	reader_id: string;
	copy_id: string;
	borrow_date?: string;
	due_date?: string;
	librarian_id: string;
}

export interface UpdateBorrowRecordRequest {
	borrow_date?: string;
	due_date?: string;
	return_date?: string;
	status?: BorrowStatus;
	librarian_id?: string;
}

export interface ReturnBookRequest {
	return_date?: string;
	librarian_id: string;
	condition_notes?: string;
}

export interface RenewBookRequest {
	librarian_id: string;
	renewal_notes?: string;
}

export interface BorrowRecordSearchQuery {
	q: string;
	page?: number;
	limit?: number;
}

export interface BorrowRecordStatusQuery {
	status: BorrowStatus;
	page?: number;
	limit?: number;
}

export interface BorrowRecordReaderQuery {
	readerId: string;
	page?: number;
	limit?: number;
}

export interface BorrowRecordCopyQuery {
	copyId: string;
	page?: number;
	limit?: number;
}

export interface BorrowRecordLibrarianQuery {
	librarianId: string;
	page?: number;
	limit?: number;
}

export interface BorrowRecordDateRangeQuery {
	startDate: string;
	endDate: string;
	page?: number;
	limit?: number;
}

export interface BorrowRecordOverdueQuery {
	page?: number;
	limit?: number;
}

export interface BorrowRecordDueSoonQuery {
	days: number;
	page?: number;
	limit?: number;
}

export interface BorrowRecordStats {
	total: number;
	borrowed: number;
	returned: number;
	overdue: number;
	renewed: number;
	byStatus: Array<{
		status: BorrowStatus;
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
	overdueBooks: Array<{
		id: string;
		reader_name: string;
		book_title: string;
		days_overdue: number;
	}>;
	dueSoonBooks: Array<{
		id: string;
		reader_name: string;
		book_title: string;
		days_until_due: number;
	}>;
}

export type BorrowRecordsResponse = PaginatedResponse<BorrowRecord>;
export type BorrowRecordResponse = BorrowRecord;
export type BorrowRecordStatsResponse = BorrowRecordStats;
