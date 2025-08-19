import { BorrowRecordsAPI } from '@/apis/borrow-records';
import type { BorrowRecordSearchQuery } from '@/types/borrow-records';
import { useQuery } from '@tanstack/react-query';

interface UseSearchBorrowRecordsOptions {
	params: BorrowRecordSearchQuery;
	enabled?: boolean;
}

export const useSearchBorrowRecords = (
	options: UseSearchBorrowRecordsOptions
) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['borrow-records-search', params],
		queryFn: () => BorrowRecordsAPI.search(params),
		enabled: enabled && !!params.q?.trim(),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		borrowRecords: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
