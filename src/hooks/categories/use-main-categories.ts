import { CategoriesAPI } from '@/apis/categories';
import type { PaginationCategoryQuery } from '@/types/categories';
import { useQuery } from '@tanstack/react-query';

interface UseMainCategoriesOptions {
	params?: PaginationCategoryQuery;
	enabled?: boolean;
}

export const useMainCategories = (options: UseMainCategoriesOptions = {}) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['main-categories', params],
		queryFn: () => CategoriesAPI.getMain(params),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		mainCategories: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
