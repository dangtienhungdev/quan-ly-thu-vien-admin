import { BookCategoriesAPI } from '@/apis/book-categories';
import type { SearchBookCategoryQuery } from '@/types/book-categories';
import { useQuery } from '@tanstack/react-query';

interface UseSearchBookCategoriesOptions {
	params: SearchBookCategoryQuery;
	enabled?: boolean;
}

export const useSearchBookCategories = (
	options: UseSearchBookCategoriesOptions
) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['book-categories', 'search', params],
		queryFn: () => BookCategoriesAPI.search(params),
		enabled: enabled && !!params.q,
		staleTime: 2 * 60 * 1000,
		gcTime: 5 * 60 * 1000,
	});

	return {
		bookCategories: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
