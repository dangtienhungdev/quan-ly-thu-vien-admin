import { NotificationsAPI } from '@/apis/notifications';
import { useQuery } from '@tanstack/react-query';

interface UseNearDueStatsOptions {
	daysBeforeDue?: number;
	enabled?: boolean;
}

export const useNearDueStats = (options: UseNearDueStatsOptions = {}) => {
	const { daysBeforeDue = 2, enabled = true } = options;

	const query = useQuery({
		queryKey: ['near-due-stats', { daysBeforeDue }],
		queryFn: () => NotificationsAPI.getNearDueStats({ daysBeforeDue }),
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
