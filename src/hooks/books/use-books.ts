import { BooksAPI } from '@/apis/books';
import type { PaginationQuery } from '@/types/common';
import { useQuery } from '@tanstack/react-query';

interface UseBooksOptions {
	params?: PaginationQuery;
	enabled?: boolean;
}

export const useBooks = (options: UseBooksOptions = {}) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['books', params],
		queryFn: () => BooksAPI.getAll(params),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		books: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
