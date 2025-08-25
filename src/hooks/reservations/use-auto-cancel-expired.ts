import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReservationsAPI } from '@/apis/reservations';

export const useAutoCancelExpired = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => ReservationsAPI.autoCancelExpired(),
		onSuccess: () => {
			// Invalidate all reservations queries
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({
				queryKey: ['reservations', 'expiring-soon'],
			});
			queryClient.invalidateQueries({
				queryKey: ['reservation-stats-by-status'],
			});
		},
	});
};
