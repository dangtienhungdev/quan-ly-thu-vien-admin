import { ReadersAPI } from '@/apis/readers';
import type { PaginationReaderQuery } from '@/types/readers';
import { useQuery } from '@tanstack/react-query';
import { omit } from 'lodash';

interface UseReadersOptions {
	params?: PaginationReaderQuery;
	enabled?: boolean;
}

export const useReaders = (options: UseReadersOptions = {}) => {
	let { params, enabled = true } = options;

	if (params?.search) {
		params.q = params.search;
	}

	params = omit(params, 'search');

	const query = useQuery({
		queryKey: ['readers', params],
		queryFn: () => ReadersAPI.getAll(params),
		enabled,
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
