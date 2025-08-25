import { useQuery } from '@tanstack/react-query';
import { ReservationsAPI } from '../../apis/reservations';
import type { ReservationDateRangeQuery } from '../../types';

export const useReservationsByDateRange = (
	params: ReservationDateRangeQuery
) => {
	return useQuery({
		queryKey: ['reservations', 'date-range', params],
		queryFn: () => ReservationsAPI.getByDateRange(params),
		enabled: !!params.startDate && !!params.endDate,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};
