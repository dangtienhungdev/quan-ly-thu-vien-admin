import { ReservationsAPI } from '@/apis/reservations';
import type { ReservationStatus } from '@/types/reservations';
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
		queryFn: () => ReservationsAPI.getByStatus({ status, page, limit }),
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
