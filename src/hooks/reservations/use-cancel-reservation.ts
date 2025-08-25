import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReservationsAPI } from '@/apis/reservations';
import { toast } from 'sonner';

export const useCancelReservation = () => {
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
		}) => ReservationsAPI.cancel(id, { librarianId, reason }),
		onSuccess: () => {
			toast.success('Hủy đặt trước thành công!');
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({ queryKey: ['reservations', 'stats'] });
			queryClient.invalidateQueries({
				queryKey: ['reservation-stats-by-status'],
			});
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi hủy đặt trước');
		},
	});
};
