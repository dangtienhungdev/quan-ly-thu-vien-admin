export interface Fine {
	id: string;
	borrow_id: string;
	fine_amount: number;
	fine_date: string;
	reason: string;
	status: 'unpaid' | 'paid';
	payment_date?: string;
	created_at: string;
	updated_at: string;
}

export interface CreateFineRequest {
	borrow_id: string;
	fine_amount: number;
	reason: string;
}

export interface UpdateFineRequest {
	fine_amount?: number;
	reason?: string;
	status?: 'unpaid' | 'paid';
	payment_date?: string;
}

export interface FineWithBorrowDetails extends Fine {
	borrow_record: {
		id: string;
		reader: {
			id: string;
			full_name: string;
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
