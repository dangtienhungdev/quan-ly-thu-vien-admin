import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReservationsAPI } from '@/apis/reservations';
import { toast } from 'sonner';

export const useDeleteReservation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => ReservationsAPI.delete(id),
		onSuccess: () => {
			toast.success('Xóa đặt trước thành công!');
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({ queryKey: ['reservations', 'stats'] });
			queryClient.invalidateQueries({
				queryKey: ['reservation-stats-by-status'],
			});
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi xóa đặt trước');
		},
	});
};
