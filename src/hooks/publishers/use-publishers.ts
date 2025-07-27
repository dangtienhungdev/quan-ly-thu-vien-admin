import type { PaginationPublisherQuery } from '@/types/publishers';
import { PublishersAPI } from '@/apis/publishers';
import { useQuery } from '@tanstack/react-query';

interface UsePublishersOptions {
	params?: PaginationPublisherQuery;
	enabled?: boolean;
}

export const usePublishers = (options: UsePublishersOptions = {}) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['publishers', params],
		queryFn: () => PublishersAPI.getAll(params),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		publishers: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
