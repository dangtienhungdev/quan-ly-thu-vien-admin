import { ReservationsAPI } from '@/apis/reservations';
import { useQuery } from '@tanstack/react-query';

export const useReservationStats = () => {
	const query = useQuery({
		queryKey: ['reservations', 'stats'],
		queryFn: () => ReservationsAPI.getStats(),
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
