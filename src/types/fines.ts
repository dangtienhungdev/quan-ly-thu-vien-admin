export enum FineStatus {
	UNPAID = 'unpaid',
	PAID = 'paid',
	PARTIALLY_PAID = 'partially_paid',
	WAIVED = 'waived',
}

export enum FineType {
	OVERDUE = 'overdue',
	DAMAGE = 'damage',
	LOST = 'lost',
	ADMINISTRATIVE = 'administrative',
}

export interface CreateFineRequest {
	borrow_id: string;
	fine_amount: number;
	paid_amount?: number;
	fine_date: string;
	payment_date?: string;
	reason: FineType;
	description?: string;
	status?: FineStatus;
	overdue_days?: number;
	daily_rate?: number;
	librarian_notes?: string;
	reader_notes?: string;
	due_date?: string;
	payment_method?: string;
	transaction_id?: string;
}

export interface Fine {
	id: string;
	borrow_id: string;
	borrowRecord?: any; // BorrowRecord type
	fine_amount: number;
	paid_amount: number;
	fine_date: string;
	payment_date?: string;
	reason: FineType;
	description?: string;
	status: FineStatus;
	overdue_days?: number;
	daily_rate?: number;
	librarian_notes?: string;
	reader_notes?: string;
	due_date?: string;
	payment_method?: string;
	transaction_id?: string;
	created_at: string;
	updated_at: string;
}

export interface FineStatistics {
	total: number;
	unpaid: number;
	paid: number;
	partially_paid: number;
	waived: number;
	total_amount: number;
	paid_amount: number;
	unpaid_amount: number;
	by_reason: Array<{
		reason: string;
		count: number;
		amount: number;
	}>;
	by_month: Array<{
		month: string;
		count: number;
		amount: number;
	}>;
}

export interface FinesResponse {
	data: Fine[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface FineResponse {
	data: Fine;
}

export interface FineWithBorrowDetails extends Fine {
	borrow_record: {
		id: string;
		reader: {
			id: string;
			fullName: string;
			card_number: string;
		};
		copy: {
			id: string;
			barcode: string;
			book: {
				id: string;
				title: string;
				isbn: string;
			};
		};
		borrow_date: string;
		due_date: string;
		return_date?: string;
		status: string;
	};
}

export interface FineStatistics {
	total: number;
	unpaid: number;
	paid: number;
	totalAmount: number;
	paidAmount: number;
	unpaidAmount: number;
	byMonth: Array<{
		month: string;
		count: number;
		amount: number;
	}>;
	byReason: Array<{
		reason: string;
		count: number;
		amount: number;
	}>;
}

export interface PaginationFineQuery {
	page?: number;
	limit?: number;
	status?: 'unpaid' | 'paid';
	reason?: string;
	reader_id?: string;
	book_id?: string;
	start_date?: string;
	end_date?: string;
}

export interface FinePaymentRequest {
	payment_date: string;
	payment_method?: string;
	notes?: string;
}
