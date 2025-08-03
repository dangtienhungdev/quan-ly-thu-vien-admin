import { ReservationsAPI } from '@/apis/reservations';
import { useQuery } from '@tanstack/react-query';

interface UseReservationsExpiringSoonOptions {
	days?: number;
	page?: number;
	limit?: number;
	enabled?: boolean;
}

export const useReservationsExpiringSoon = (
	options: UseReservationsExpiringSoonOptions = {}
) => {
	const { days = 3, page = 1, limit = 10, enabled = true } = options;

	const query = useQuery({
		queryKey: ['reservations', 'expiring-soon', { days, page, limit }],
		queryFn: () => ReservationsAPI.getExpiringSoon({ days, page, limit }),
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
