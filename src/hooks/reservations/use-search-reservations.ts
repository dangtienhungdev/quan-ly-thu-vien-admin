import { useQuery } from '@tanstack/react-query';
import { ReservationsAPI } from '../../apis/reservations';
import type { ReservationSearchQuery } from '../../types';

export const useSearchReservations = (params: ReservationSearchQuery) => {
	return useQuery({
		queryKey: ['reservations', 'search', params],
		queryFn: () => ReservationsAPI.search(params),
		enabled: !!params.q && params.q.trim().length > 0,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};
