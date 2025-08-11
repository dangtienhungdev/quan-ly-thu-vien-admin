import { GradeLevelsAPI } from '@/apis/grade-levels';
import type { SearchGradeLevelQuery } from '@/types/grade-levels';
import { useQuery } from '@tanstack/react-query';

interface UseSearchGradeLevelsOptions {
	params: SearchGradeLevelQuery;
	enabled?: boolean;
}

export const useSearchGradeLevels = (options: UseSearchGradeLevelsOptions) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['grade-levels', 'search', params],
		queryFn: () => GradeLevelsAPI.search(params),
		enabled: enabled && !!params.q,
		staleTime: 2 * 60 * 1000,
		gcTime: 5 * 60 * 1000,
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
