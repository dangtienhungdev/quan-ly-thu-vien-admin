import { BooksAPI } from '@/apis/books';
import type { BookSearchQuery } from '@/types/books';
import { useQuery } from '@tanstack/react-query';

interface UseSearchBooksOptions {
	params: BookSearchQuery;
	enabled?: boolean;
}

export const useSearchBooks = (options: UseSearchBooksOptions) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['books', 'search', params],
		queryFn: () => BooksAPI.search(params),
		enabled: enabled && !!params.q,
		staleTime: 2 * 60 * 1000, // 2 minutes
		gcTime: 5 * 60 * 1000, // 5 minutes
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
