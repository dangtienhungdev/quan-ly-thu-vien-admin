import type { PaginationReaderQuery } from '@/types/readers';
import { ReadersAPI } from '@/apis/readers';
import { useQuery } from '@tanstack/react-query';

interface UseExpiredCardsOptions {
	params?: PaginationReaderQuery;
	enabled?: boolean;
}

export const useExpiredCards = (options: UseExpiredCardsOptions = {}) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['expired-cards', params],
		queryFn: () => ReadersAPI.getExpiredCards(params),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		expiredCards: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
