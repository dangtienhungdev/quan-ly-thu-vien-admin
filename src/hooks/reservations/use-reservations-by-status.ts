import type { ReservationStatus } from '@/types/reservations';
import { ReservationsAPI } from '@/apis/reservations';
import { useQuery } from '@tanstack/react-query';

interface UseReservationsByStatusOptions {
	status: ReservationStatus;
	page?: number;
	limit?: number;
	enabled?: boolean;
}

export const useReservationsByStatus = (
	options: UseReservationsByStatusOptions
) => {
	const { status, page = 1, limit = 10, enabled = true } = options;

	const query = useQuery({
		queryKey: ['reservations', 'status', status, { page, limit }],
		queryFn: () => ReservationsAPI.getByStatus(status),
		enabled,
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
