import { ReservationsAPI } from '@/apis/reservations';
import { useQuery } from '@tanstack/react-query';

interface UseReservationsByReaderOptions {
	readerId: string;
	page?: number;
	limit?: number;
	enabled?: boolean;
}

export const useReservationsByReader = (
	options: UseReservationsByReaderOptions
) => {
	const { readerId, page = 1, limit = 10, enabled = true } = options;

	const query = useQuery({
		queryKey: ['reservations', 'by-reader', readerId, { page, limit }],
		queryFn: () => ReservationsAPI.getByReader({ readerId, page, limit }),
		enabled: enabled && !!readerId,
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
