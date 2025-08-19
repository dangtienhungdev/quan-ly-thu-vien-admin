import { BorrowRecordsAPI } from '@/apis/borrow-records';
import type { BorrowRecordOverdueQuery } from '@/types/borrow-records';
import { useQuery } from '@tanstack/react-query';

interface UseOverdueBorrowRecordsOptions {
	params?: BorrowRecordOverdueQuery;
	enabled?: boolean;
}

export const useOverdueBorrowRecords = (
	options: UseOverdueBorrowRecordsOptions = {}
) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['borrow-records-overdue', params],
		queryFn: () => BorrowRecordsAPI.getOverdue(params),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		overdueRecords: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
