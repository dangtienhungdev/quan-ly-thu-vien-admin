import { NotificationsAPI } from '@/apis/notifications';
import { useQuery } from '@tanstack/react-query';

interface UseNearDueBooksOptions {
	page?: number;
	limit?: number;
	daysBeforeDue?: number;
	enabled?: boolean;
}

export const useNearDueBooks = (options: UseNearDueBooksOptions = {}) => {
	const { page = 1, limit = 10, daysBeforeDue = 2, enabled = true } = options;

	const query = useQuery({
		queryKey: ['near-due-books', { page, limit, daysBeforeDue }],
		queryFn: () =>
			NotificationsAPI.getNearDueBooks({ page, limit, daysBeforeDue }),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		books: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
