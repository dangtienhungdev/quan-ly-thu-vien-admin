import { BorrowRecordsAPI } from '@/apis/borrow-records';
import type { BorrowRecordPendingApprovalQuery } from '@/types/borrow-records';
import { useQuery } from '@tanstack/react-query';

interface UsePendingApprovalBorrowRecordsOptions {
	params?: BorrowRecordPendingApprovalQuery;
	enabled?: boolean;
}

export const usePendingApprovalBorrowRecords = (
	options: UsePendingApprovalBorrowRecordsOptions = {}
) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['borrow-records-pending-approval', params],
		queryFn: () => BorrowRecordsAPI.getPendingApproval(params),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		pendingRecords: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
