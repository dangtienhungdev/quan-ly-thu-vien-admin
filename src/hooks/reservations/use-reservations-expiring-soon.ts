import { ReservationsAPI } from '@/apis/reservations';
import { useQuery } from '@tanstack/react-query';

interface UseReservationsExpiringSoonOptions {
	days?: number;
	enabled?: boolean;
}

export const useReservationsExpiringSoon = (
	options: UseReservationsExpiringSoonOptions = {}
) => {
	const { days = 1, enabled = true } = options;

	const query = useQuery({
		queryKey: ['reservations', 'expiring-soon', { days }],
		queryFn: () => ReservationsAPI.getExpiringSoon({ days }),
		enabled,
	});

	return {
		reservations: query.data || [],
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
