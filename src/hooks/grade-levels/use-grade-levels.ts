import { GradeLevelsAPI } from '@/apis/grade-levels';
import type { PaginationGradeLevelQuery } from '@/types/grade-levels';
import { useQuery } from '@tanstack/react-query';

interface UseGradeLevelsOptions {
	params?: PaginationGradeLevelQuery;
	enabled?: boolean;
}

export const useGradeLevels = (options: UseGradeLevelsOptions = {}) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['grade-levels', params],
		queryFn: () => GradeLevelsAPI.getAll(params),
		enabled,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

	return {
		gradeLevels: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
