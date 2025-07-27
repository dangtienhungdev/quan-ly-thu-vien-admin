import type { PaginationQuery } from './common';

export type ReaderTypeName = 'student' | 'teacher' | 'staff';

export type PaginationReaderTypeQuery = PaginationQuery;

export type ReaderTypeConfig = {
	id: string;
	typeName: ReaderTypeName;
	maxBorrowLimit: number;
	borrowDurationDays: number;
	description: string;
	lateReturnFinePerDay: number;
	createdAt: string;
	updatedAt: string;
};

export type CreateReaderTypeRequest = {
	typeName: ReaderTypeName;
	maxBorrowLimit: number;
	borrowDurationDays: number;
	description: string;
	lateReturnFinePerDay: number;
};

export type UpdateReaderTypeRequest = {
	maxBorrowLimit?: number;
	borrowDurationDays?: number;
	description?: string;
	lateReturnFinePerDay?: number;
};

export type ReaderTypeStatistics = {
	typeName: ReaderTypeName;
	totalReaders: number;
	activeBorrows: number;
	averageBorrowDuration: number;
	totalFines: number;
};

export type DefaultSettings = {
	student: {
		maxBorrowLimit: number;
		borrowDurationDays: number;
		lateReturnFinePerDay: number;
	};
	teacher: {
		maxBorrowLimit: number;
		borrowDurationDays: number;
		lateReturnFinePerDay: number;
	};
	staff: {
		maxBorrowLimit: number;
		borrowDurationDays: number;
		lateReturnFinePerDay: number;
	};
};
