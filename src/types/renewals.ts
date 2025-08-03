export interface Renewal {
	id: string;
	borrow_id: string;
	renewal_date: string;
	new_due_date: string;
	librarian_id: string;
	created_at: string;
	updated_at: string;
}

export interface CreateRenewalRequest {
	borrow_id: string;
	new_due_date: string;
}

export interface UpdateRenewalRequest {
	new_due_date?: string;
}

export interface RenewalWithBorrowDetails extends Renewal {
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
	librarian: {
		id: string;
		username: string;
		email: string;
	};
}

export interface RenewalStatistics {
	total: number;
	byMonth: Array<{
		month: string;
		count: number;
	}>;
	byLibrarian: Array<{
		librarian_id: string;
		librarian_name: string;
		count: number;
	}>;
	byBook: Array<{
		book_id: string;
		book_title: string;
		count: number;
	}>;
}

export interface PaginationRenewalQuery {
	page?: number;
	limit?: number;
	borrow_id?: string;
	reader_id?: string;
	book_id?: string;
	librarian_id?: string;
	start_date?: string;
	end_date?: string;
}

export interface RenewalValidationResult {
	canRenew: boolean;
	reason?: string;
	maxRenewals?: number;
	currentRenewals?: number;
	hasReservations?: boolean;
}
