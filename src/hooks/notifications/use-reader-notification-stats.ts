import { NotificationsAPI } from '@/apis/notifications';
import { useQuery } from '@tanstack/react-query';

interface UseReaderNotificationStatsOptions {
	readerId: string;
	enabled?: boolean;
}

export const useReaderNotificationStats = (
	options: UseReaderNotificationStatsOptions
) => {
	const { readerId, enabled = true } = options;

	const query = useQuery({
		queryKey: ['reader-notification-stats', readerId],
		queryFn: () => NotificationsAPI.getReaderNotificationStats(readerId),
		enabled: enabled && !!readerId,
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
