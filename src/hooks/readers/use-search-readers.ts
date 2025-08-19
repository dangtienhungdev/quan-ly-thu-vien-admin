import { ReadersAPI } from '@/apis/readers';
import type { SearchReaderQuery } from '@/types/readers';
import { useQuery } from '@tanstack/react-query';

interface UseSearchReadersOptions {
	params: SearchReaderQuery;
	enabled?: boolean;
}

export const useSearchReaders = (options: UseSearchReadersOptions) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['readers-search', params],
		queryFn: () => ReadersAPI.search(params),
		enabled: enabled && !!params.q?.trim(),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		readers: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
