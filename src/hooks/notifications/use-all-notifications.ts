import { NotificationsAPI } from '@/apis/notifications';
import type { NotificationFilters } from '@/types/notifications';
import { useQuery } from '@tanstack/react-query';

interface UseAllNotificationsOptions {
	filters?: NotificationFilters;
	enabled?: boolean;
}

export const useAllNotifications = (
	options: UseAllNotificationsOptions = {}
) => {
	const { filters, enabled = true } = options;

	const query = useQuery({
		queryKey: ['notifications', filters],
		queryFn: () => NotificationsAPI.getAllNotifications(filters),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		notifications: query.data?.data || [],
		meta: {
			total: query.data?.total || 0,
			page: query.data?.page || 1,
			limit: query.data?.limit || 10,
			totalPages: query.data?.totalPages || 0,
		},
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
