import { PublishersAPI } from '@/apis/publishers';
import { useQuery } from '@tanstack/react-query';

interface UsePublisherStatsOptions {
	enabled?: boolean;
}

export const usePublisherStats = (options: UsePublisherStatsOptions = {}) => {
	const { enabled = true } = options;

	const query = useQuery({
		queryKey: ['publisher-stats'],
		queryFn: () => PublishersAPI.getStats(),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		stats: query.data,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
