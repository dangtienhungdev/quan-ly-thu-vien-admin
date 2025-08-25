import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReservationsAPI } from '@/apis/reservations';
import { toast } from 'sonner';

export const useExpireReservation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			librarianId,
			reason,
		}: {
			id: string;
			librarianId: string;
			reason?: string;
		}) => ReservationsAPI.expire(id, { librarianId, reason }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({ queryKey: ['reservations', 'stats'] });
			queryClient.invalidateQueries({
				queryKey: ['reservation-stats-by-status'],
			});
		},
		onError: (error: any) => {
			toast.error(
				error.message || 'Có lỗi xảy ra khi đánh dấu đặt trước hết hạn'
			);
		},
	});
};
