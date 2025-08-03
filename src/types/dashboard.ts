export interface DashboardStatistics {
	// Thống kê tổng quan
	overview: {
		totalBooks: number;
		totalReaders: number;
		totalBorrows: number;
		totalReservations: number;
		totalFines: number;
		totalRevenue: number;
	};

	// Thống kê sách
	books: {
		totalPhysical: number;
		totalEbooks: number;
		availableCopies: number;
		borrowedCopies: number;
		reservedCopies: number;
		damagedCopies: number;
		popularBooks: Array<{
			id: string;
			title: string;
			borrowCount: number;
			isbn: string;
		}>;
	};

	// Thống kê độc giả
	readers: {
		totalActive: number;
		totalSuspended: number;
		totalExpired: number;
		byType: Array<{
			type: string;
			count: number;
		}>;
		topReaders: Array<{
			id: string;
			fullName: string;
			borrowCount: number;
			cardNumber: string;
		}>;
	};

	// Thống kê mượn trả
	borrows: {
		totalActive: number;
		totalOverdue: number;
		totalReturned: number;
		byStatus: Array<{
			status: string;
			count: number;
		}>;
		recentBorrows: Array<{
			id: string;
			readerName: string;
			bookTitle: string;
			borrowDate: string;
			dueDate: string;
		}>;
	};

	// Thống kê phạt
	fines: {
		totalUnpaid: number;
		totalPaid: number;
		totalAmount: number;
		paidAmount: number;
		unpaidAmount: number;
		byReason: Array<{
			reason: string;
			count: number;
			amount: number;
		}>;
	};

	// Thống kê theo thời gian
	trends: {
		dailyBorrows: Array<{
			date: string;
			count: number;
		}>;
		monthlyBorrows: Array<{
			month: string;
			count: number;
		}>;
		dailyReturns: Array<{
			date: string;
			count: number;
		}>;
		dailyFines: Array<{
			date: string;
			amount: number;
		}>;
	};

	// Thống kê không gian lưu trữ
	storage: {
		totalPhysicalSpace: number;
		usedPhysicalSpace: number;
		totalDigitalSpace: number;
		usedDigitalSpace: number;
		byLocation: Array<{
			location: string;
			count: number;
			percentage: number;
		}>;
	};

	// Cảnh báo và thông báo
	alerts: {
		overdueBooks: Array<{
			id: string;
			readerName: string;
			bookTitle: string;
			daysOverdue: number;
		}>;
		expiringCards: Array<{
			id: string;
			readerName: string;
			cardNumber: string;
			expiryDate: string;
		}>;
		lowStockBooks: Array<{
			id: string;
			title: string;
			availableCopies: number;
			minThreshold: number;
		}>;
		damagedBooks: Array<{
			id: string;
			title: string;
			damageCount: number;
		}>;
	};
}

export interface ChartData {
	labels: string[];
	datasets: Array<{
		label: string;
		data: number[];
		backgroundColor?: string | string[];
		borderColor?: string | string[];
		borderWidth?: number;
	}>;
}

export interface DashboardFilters {
	startDate?: string;
	endDate?: string;
	readerType?: string;
	bookCategory?: string;
	location?: string;
}
