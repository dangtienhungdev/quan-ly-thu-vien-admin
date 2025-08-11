import { GradeLevelsAPI } from '@/apis/grade-levels';
import { useQuery } from '@tanstack/react-query';

export const useAllGradeLevels = (enabled: boolean = true) => {
	const query = useQuery({
		queryKey: ['grade-levels', 'all'],
		queryFn: () => GradeLevelsAPI.getAllNoPaginate(),
		enabled,
		staleTime: 10 * 60 * 1000,
		gcTime: 20 * 60 * 1000,
	});

	return {
		gradeLevels: query.data || [],
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
