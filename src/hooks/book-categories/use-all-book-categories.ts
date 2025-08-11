import { BookCategoriesAPI } from '@/apis/book-categories';
import { useQuery } from '@tanstack/react-query';

export const useAllBookCategories = (enabled: boolean = true) => {
	const query = useQuery({
		queryKey: ['book-categories', 'all'],
		queryFn: () => BookCategoriesAPI.getAllNoPaginate(),
		enabled,
		staleTime: 10 * 60 * 1000,
		gcTime: 20 * 60 * 1000,
	});

	return {
		bookCategories: query.data || [],
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
