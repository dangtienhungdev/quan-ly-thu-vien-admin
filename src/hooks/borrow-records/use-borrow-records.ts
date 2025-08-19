import { BorrowRecordsAPI } from '@/apis/borrow-records';
import { useQuery } from '@tanstack/react-query';

interface UseBorrowRecordsOptions {
	params?: {
		page?: number;
		limit?: number;
	};
	enabled?: boolean;
}

export const useBorrowRecords = (options: UseBorrowRecordsOptions = {}) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['borrow-records', params],
		queryFn: () => BorrowRecordsAPI.getAll(params),
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
