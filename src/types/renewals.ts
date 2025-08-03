import type { BaseEntity, PaginatedResponse } from './common';

export type RenewalStatus = 'approved' | 'pending' | 'rejected';

export interface Renewal extends BaseEntity {
	borrow_id: string;
	renewal_date: string;
	new_due_date: string;
	librarian_id: string;
	reason?: string;
	librarian_notes?: string;
	renewal_number: number;
	status: RenewalStatus;
	borrow?: {
		id: string;
		reader_id: string;
		copy_id: string;
		borrow_date: string;
		due_date: string;
		status: string;
		reader?: {
			id: string;
			fullName: string;
			cardNumber: string;
		};
		physicalCopy?: {
			id: string;
			barcode: string;
			book?: {
				id: string;
				title: string;
				isbn: string;
			};
		};
	};
	librarian?: {
		id: string;
		username: string;
		email: string;
	};
}

export interface CreateRenewalRequest {
	borrow_id: string;
	renewal_date: string;
	new_due_date: string;
	librarian_id: string;
	reason?: string;
	librarian_notes?: string;
	renewal_number: number;
	status?: RenewalStatus;
}

export interface UpdateRenewalRequest {
	renewal_date?: string;
	new_due_date?: string;
	librarian_id?: string;
	reason?: string;
	librarian_notes?: string;
	renewal_number?: number;
	status?: RenewalStatus;
}

export interface ApproveRenewalRequest {
	librarianNotes?: string;
}

export interface RejectRenewalRequest {
	librarianNotes?: string;
}

export interface RenewalSearchQuery {
	q: string;
	page?: number;
	limit?: number;
}

export interface RenewalStatusQuery {
	status: RenewalStatus;
	page?: number;
	limit?: number;
}

export interface RenewalBorrowQuery {
	borrowId: string;
	page?: number;
	limit?: number;
}

export interface RenewalLibrarianQuery {
	librarianId: string;
	page?: number;
	limit?: number;
}

export interface RenewalStats {
	total: number;
	approved: number;
	pending: number;
	rejected: number;
	byMonth: Array<{
		month: string;
		count: number;
	}>;
}

export type RenewalsResponse = PaginatedResponse<Renewal>;
export type RenewalResponse = Renewal;
export type RenewalStatsResponse = RenewalStats;
