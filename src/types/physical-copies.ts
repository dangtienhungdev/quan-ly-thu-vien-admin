import type { BaseEntity, PaginatedResponse } from './common';

export type CopyStatus =
	| 'available'
	| 'borrowed'
	| 'reserved'
	| 'damaged'
	| 'lost'
	| 'maintenance';
export type CopyCondition = 'new' | 'good' | 'worn' | 'damaged';

export interface PhysicalCopy extends BaseEntity {
	book_id: string;
	barcode: string;
	status: CopyStatus;
	current_condition: CopyCondition;
	condition_details?: string;
	purchase_date: string;
	purchase_price: number;
	location: string;
	notes?: string;
	last_checkup_date?: string;
	is_archived: boolean;
	book?: PhysicalCopyBookInfo;
}

export interface PhysicalCopyBookInfo {
	id: string;
	title: string;
	isbn: string;
	slug: string;
	cover_image?: string;
}

export interface CreatePhysicalCopyRequest {
	book_id: string;
	barcode: string;
	purchase_date: string;
	purchase_price: number;
	location: string;
	current_condition?: CopyCondition;
	condition_details?: string;
	notes?: string;
}

export interface UpdatePhysicalCopyRequest {
	barcode?: string;
	purchase_date?: string;
	purchase_price?: number;
	location?: string;
	current_condition?: CopyCondition;
	condition_details?: string;
	notes?: string;
}

export interface UpdateCopyStatusRequest {
	status: CopyStatus;
	notes?: string;
}

export interface UpdateCopyConditionRequest {
	condition: CopyCondition;
	details?: string;
}

export interface CreateManyPhysicalCopiesRequest {
	count: number;
	purchase_date: string;
	purchase_price: number;
	location: string;
}

export interface PhysicalCopySearchQuery {
	q: string;
	page?: number;
	limit?: number;
}

export interface PhysicalCopyStatusQuery {
	status: CopyStatus;
	page?: number;
	limit?: number;
}

export interface PhysicalCopyConditionQuery {
	condition: CopyCondition;
	page?: number;
	limit?: number;
}

export interface PhysicalCopyLocationQuery {
	location: string;
	page?: number;
	limit?: number;
}

export interface PhysicalCopyBookQuery {
	bookId: string;
	page?: number;
	limit?: number;
}

export interface PhysicalCopyBarcodeQuery {
	barcode: string;
}

export interface PhysicalCopyStats {
	total: number;
	available: number;
	borrowed: number;
	reserved: number;
	damaged: number;
	lost: number;
	maintenance: number;
	archived: number;
	byCondition: Array<{
		condition: CopyCondition;
		count: number;
	}>;
	byLocation: Array<{
		location: string;
		count: number;
	}>;
	totalValue: number;
}

export type PhysicalCopiesResponse = PaginatedResponse<PhysicalCopy>;
export type PhysicalCopyResponse = PhysicalCopy;
export type BulkCreatePhysicalCopiesResponse = PhysicalCopy[];
export type PhysicalCopyStatsResponse = PhysicalCopyStats;
