import { BorrowRecordsAPI } from '@/apis/borrow-records';
import type { BorrowRecordStatusQuery } from '@/types/borrow-records';
import { useQuery } from '@tanstack/react-query';

interface UseBorrowRecordsByStatusOptions {
	params: BorrowRecordStatusQuery;
	enabled?: boolean;
}

export const useBorrowRecordsByStatus = (
	options: UseBorrowRecordsByStatusOptions
) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['borrow-records-by-status', params],
		queryFn: () => BorrowRecordsAPI.getByStatus(params),
		enabled,
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
