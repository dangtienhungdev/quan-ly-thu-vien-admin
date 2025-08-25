import { NotificationsAPI } from '@/apis/notifications';
import { useQuery } from '@tanstack/react-query';

interface UseNotificationStatsOptions {
	enabled?: boolean;
}

export const useNotificationStats = (
	options: UseNotificationStatsOptions = {}
) => {
	const { enabled = true } = options;

	const query = useQuery({
		queryKey: ['notification-stats'],
		queryFn: () => NotificationsAPI.getNotificationStats(),
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
