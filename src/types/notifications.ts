// ===== NEAR DUE BOOKS =====

export interface NearDueBook {
	id: string;
	reader: {
		id: string;
		fullName: string;
	};
	physicalCopy: {
		book: {
			title: string;
		};
	};
	due_date: string;
}

export interface NearDueStats {
	totalNearDue: number;
	byDaysUntilDue: Array<{
		daysUntilDue: number;
		count: number;
	}>;
	byReader: Array<{
		readerName: string;
		count: number;
	}>;
	byBookCategory: Array<{
		category: string;
		count: number;
	}>;
}

// ===== SEND REMINDERS =====

export interface SendReminderRequest {
	daysBeforeDue?: number;
	customMessage?: string;
	readerId?: string;
}

export interface SendReminderResponse {
	success: boolean;
	message: string;
	totalReaders: number;
	notificationsSent: number;
	details: Array<{
		readerId: string;
		readerName: string;
		bookTitle: string;
		dueDate: string;
		daysUntilDue: number;
	}>;
}

// ===== NOTIFICATIONS =====

export interface Notification {
	id: string;
	title: string;
	message: string;
	type: 'due_date_reminder' | 'overdue_notice' | 'general';
	status: 'pending' | 'sent' | 'read' | 'failed';
	metadata?: {
		bookTitle?: string;
		dueDate?: string;
		daysUntilDue?: number;
		[s: string]: any;
	};
	read_at?: string;
	sent_at?: string;
	error_message?: string;
	created_at: string;
	updated_at: string;
}

export interface NotificationResponse {
	data: Notification[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface NotificationFilters {
	page?: number;
	limit?: number;
	status?: 'pending' | 'sent' | 'read' | 'failed';
	type?: 'due_date_reminder' | 'overdue_notice' | 'general';
	readerId?: string;
	startDate?: string;
	endDate?: string;
}

export interface NotificationStats {
	total: number;
	byStatus: Array<{
		status: string;
		count: number;
	}>;
	byType: Array<{
		type: string;
		count: number;
	}>;
	byDate: Array<{
		date: string;
		count: number;
	}>;
}
