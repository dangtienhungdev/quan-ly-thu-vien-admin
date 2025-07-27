import type { PaginationQuery } from './common';

export type PaginationReaderQuery = PaginationQuery;

export type Reader = {
	id: string;
	fullName: string;
	dob: string;
	gender: 'male' | 'female' | 'other';
	address: string;
	phone: string;
	cardNumber: string;
	cardIssueDate: string;
	cardExpiryDate: string;
	isActive: boolean;
	userId: string;
	readerTypeId: string;
	readerType?: {
		id: string;
		typeName: string;
		description?: string;
	};
	user?: {
		id: string;
		username: string;
		email: string;
		userCode: string;
	};
	created_at: string;
	updated_at: string;
};

export type CreateReaderRequest = {
	fullName: string;
	dob: string;
	gender: 'male' | 'female' | 'other';
	address: string;
	phone: string;
	userId: string;
	readerTypeId: string;
	cardNumber?: string;
	cardIssueDate?: string;
	cardExpiryDate: string;
};

export type UpdateReaderRequest = {
	fullName?: string;
	dob?: string;
	gender?: 'male' | 'female' | 'other';
	address?: string;
	phone?: string;
	readerTypeId?: string;
	cardExpiryDate?: string;
};

export type SearchReaderQuery = PaginationQuery & {
	q?: string;
};

export type ExpiringSoonQuery = PaginationQuery & {
	days?: number;
};

export type RenewCardRequest = {
	newExpiryDate: string;
};

export type CardExpiryCheck = {
	isExpired: boolean;
	daysUntilExpiry: number;
	expiryDate: string;
};

export type GeneratedCardNumber = {
	cardNumber: string;
};
