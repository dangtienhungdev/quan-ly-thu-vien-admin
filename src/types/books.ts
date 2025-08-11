import type {
	BaseEntity,
	BookType,
	PaginatedResponse,
	PhysicalType,
} from './common';

export interface Book extends BaseEntity {
	title: string;
	isbn: string;
	slug: string;
	publish_year: number;
	edition: string;
	description?: string;
	cover_image?: string;
	language: string;
	page_count: number;
	book_type: BookType;
	physical_type: PhysicalType;
	publisher_id: string;
	category_id: string;
	main_category_id?: string | null;
	publisher?: BookPublisher;
	category?: BookRelatedCategory;
	authors?: BookAuthor[];
}

export interface CreateBookRequest {
	title: string;
	isbn: string;
	publish_year: number;
	edition: string;
	description?: string;
	cover_image?: string;
	language: string;
	page_count: number;
	book_type: BookType;
	physical_type: PhysicalType;
	publisher_id: string;
	category_id: string;
	main_category_id?: string | null;
	author_ids?: string[];
	grade_level_ids?: string[];
}

export interface UpdateBookRequest {
	title?: string;
	isbn?: string;
	publish_year?: number;
	edition?: string;
	description?: string;
	cover_image?: string;
	language?: string;
	page_count?: number;
	book_type?: BookType;
	physical_type?: PhysicalType;
	publisher_id?: string;
	category_id?: string;
	main_category_id?: string | null;
	author_ids?: string[];
	grade_level_ids?: string[];
}

export interface BookSearchQuery {
	q: string;
	page?: number;
	limit?: number;
}

export interface BookByIsbnQuery {
	isbn: string;
}

export type BooksResponse = PaginatedResponse<Book>;
export type BookResponse = Book;
export type BulkCreateBookResponse = Book[];

// Related types (will be imported from their respective modules)
// These are simplified versions for book relationships
export interface BookPublisher {
	id: string;
	publisherName: string;
	slug: string;
}

export interface BookRelatedCategory {
	id: string;
	category_name: string;
	slug: string;
}

export interface BookAuthor {
	id: string;
	author_name: string;
	slug: string;
}
