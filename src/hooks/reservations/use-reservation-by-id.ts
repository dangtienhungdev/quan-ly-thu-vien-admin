import { ReservationsAPI } from '@/apis/reservations';
import { useQuery } from '@tanstack/react-query';

interface UseReservationByIdOptions {
	id: string;
	enabled?: boolean;
}

export const useReservationById = (options: UseReservationByIdOptions) => {
	const { id, enabled = true } = options;

	const query = useQuery({
		queryKey: ['reservations', 'by-id', id],
		queryFn: () => ReservationsAPI.getById(id),
		enabled: enabled && !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		reservation: query.data,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
