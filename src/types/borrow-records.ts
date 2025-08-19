import type { BaseEntity, PaginatedResponse } from './common';

export type BorrowStatus =
	| 'pending_approval'
	| 'borrowed'
	| 'returned'
	| 'overdue'
	| 'renewed';

export interface BorrowRecord extends BaseEntity {
	reader_id: string;
	copy_id: string;
	borrow_date: string;
	due_date: string;
	return_date?: string;
	status: BorrowStatus;
	librarian_id: string;
	borrow_notes?: string;
	return_notes?: string;
	renewal_count: number;
	reader?: {
		id: string;
		user: any;
		readerType: any;
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
	physicalCopy?: {
		id: string;
		book_id: string;
		book: {
			id: string;
			title: string;
			slug: string;
			isbn: string;
			publish_year: number;
			edition: string;
			description: string;
			cover_image?: string;
			language: string;
			page_count: number;
			book_type: string;
			physical_type: string;
			publisher_id: string;
			category_id: string;
			created_at: string;
			updated_at: string;
		};
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
	librarian?: {
		id: string;
		userCode: string;
		username: string;
		email: string;
		role: string;
		accountStatus: string;
		lastLogin: string;
		createdAt: string;
		updatedAt: string;
	};
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
	return_date?: string;
	status?: BorrowStatus;
	librarian_id: string;
	borrow_notes?: string;
	return_notes?: string;
	renewal_count?: number;
}

export interface UpdateBorrowRecordRequest {
	borrow_date?: string;
	due_date?: string;
	return_date?: string;
	status?: BorrowStatus;
	librarian_id?: string;
	borrow_notes?: string;
	return_notes?: string;
	renewal_count?: number;
}

export interface ReturnBookRequest {
	returnNotes?: string;
}

export interface RenewBookRequest {
	newDueDate: string;
}

export interface ApproveBorrowRequest {
	librarianId: string;
	notes?: string;
}

export interface RejectBorrowRequest {
	librarianId: string;
	reason: string;
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

export interface BorrowRecordPendingApprovalQuery {
	page?: number;
	limit?: number;
}

export interface BorrowRecordStats {
	total: number;
	borrowed: number;
	returned: number;
	overdue: number;
	renewed: number;
	pending_approval: number;
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

export interface SendRemindersRequest {
	daysBeforeDue: number;
	customMessage: string;
	readerId: string;
}

export interface SendRemindersResponse {
	success: boolean;
	message: string;
	totalReaders: number;
	notificationsSent: number;
	details: [
		{
			readerId: string;
			readerName: string;
			bookTitle: string;
			dueDate: string;
			daysUntilDue: number;
		}
	];
}
