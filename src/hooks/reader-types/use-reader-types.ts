import type { PaginationReaderTypeQuery } from '@/types/reader-types';
import { ReaderTypesAPI } from '@/apis/reader-types';
import { useQuery } from '@tanstack/react-query';

interface UseReaderTypesOptions {
	params?: PaginationReaderTypeQuery;
	enabled?: boolean;
}

export const useReaderTypes = (options: UseReaderTypesOptions = {}) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['reader-types', params],
		queryFn: () => ReaderTypesAPI.getAll(params),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		readerTypes: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
