import type { ExpiringSoonQuery } from '@/types/readers';
import { ReadersAPI } from '@/apis/readers';
import { useQuery } from '@tanstack/react-query';

interface UseExpiringSoonOptions {
	params: ExpiringSoonQuery;
	enabled?: boolean;
}

export const useExpiringSoon = (options: UseExpiringSoonOptions) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['expiring-soon', params],
		queryFn: () => ReadersAPI.getExpiringSoon(params),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		expiringSoon: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
