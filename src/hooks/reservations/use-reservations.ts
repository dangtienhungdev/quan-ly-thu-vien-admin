import type {
	ReservationStatus,
	ReservationStatusQuery,
} from '@/types/reservations';

import { ReservationsAPI } from '@/apis/reservations';
import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

interface UseReservationsOptions {
	page?: number;
	limit?: number;
	searchQuery?: string;
	enabled?: boolean;
}

export const useReservations = (options: UseReservationsOptions = {}) => {
	const [params] = useSearchParams();
	const status = params.get('status') || 'all';
	const page = params.get('page') || '1';
	const limit = params.get('limit') || '20';
	const searchQuery = params.get('searchQuery') || '';

	const reservationParams = {
		status,
		page: Number(page),
		limit: Number(limit),
		q: searchQuery || '',
	};

	const { enabled = true } = options;

	const query = useQuery({
		queryKey: ['reservations', reservationParams],
		queryFn: () => {
			if (reservationParams.q) {
				return ReservationsAPI.search(reservationParams);
			}
			if (status !== 'all') {
				return ReservationsAPI.getByStatus(
					status as ReservationStatus,
					_.omit(reservationParams, 'q', 'status') as ReservationStatusQuery
				);
			}
			return ReservationsAPI.getAll(_.omit(reservationParams, 'q', 'status'));
		},
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
