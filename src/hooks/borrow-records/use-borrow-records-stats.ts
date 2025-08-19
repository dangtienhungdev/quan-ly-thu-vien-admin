import { BorrowRecordsAPI } from '@/apis/borrow-records';
import { useQuery } from '@tanstack/react-query';

interface UseBorrowRecordsStatsOptions {
	enabled?: boolean;
}

export const useBorrowRecordsStats = (
	options: UseBorrowRecordsStatsOptions = {}
) => {
	const { enabled = true } = options;

	const query = useQuery({
		queryKey: ['borrow-records-stats'],
		queryFn: () => BorrowRecordsAPI.getStats(),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		stats: query.data,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
