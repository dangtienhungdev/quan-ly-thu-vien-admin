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
	publisher?: BookPublisher;
	category?: BookCategory;
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
	publisher_name: string;
	slug: string;
}

export interface BookCategory {
	id: string;
	category_name: string;
	slug: string;
}

export interface BookAuthor {
	id: string;
	author_name: string;
	slug: string;
}
