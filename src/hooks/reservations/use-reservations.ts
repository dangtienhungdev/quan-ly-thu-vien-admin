import { ReservationsAPI } from '@/apis/reservations';
import { useQuery } from '@tanstack/react-query';

interface UseReservationsOptions {
	page?: number;
	limit?: number;
	searchQuery?: string;
	enabled?: boolean;
}

export const useReservations = (options: UseReservationsOptions = {}) => {
	const { page = 1, limit = 10, searchQuery, enabled = true } = options;

	const query = useQuery({
		queryKey: ['reservations', { page, limit, searchQuery }],
		queryFn: () => {
			if (searchQuery) {
				return ReservationsAPI.search({ q: searchQuery, page, limit });
			}
			return ReservationsAPI.getAll({ page, limit });
		},
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		reservations: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
