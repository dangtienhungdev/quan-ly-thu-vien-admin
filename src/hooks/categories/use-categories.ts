import { CategoriesAPI } from '@/apis/categories';
import type { PaginationCategoryQuery } from '@/types/categories';
import { useQuery } from '@tanstack/react-query';

interface UseCategoriesOptions {
	params?: PaginationCategoryQuery;
	enabled?: boolean;
}

export const useCategories = (options: UseCategoriesOptions = {}) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['categories', params],
		queryFn: () => CategoriesAPI.getAll(params),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		categories: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
