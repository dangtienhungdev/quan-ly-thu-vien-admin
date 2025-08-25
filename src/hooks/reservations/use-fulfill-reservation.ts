import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReservationsAPI } from '@/apis/reservations';
import { toast } from 'sonner';

export const useFulfillReservation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: { librarianId: string; notes?: string };
		}) => ReservationsAPI.fulfill(id, data),
		onSuccess: () => {
			toast.success('Thực hiện đặt trước thành công!');
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({ queryKey: ['reservations', 'stats'] });
			queryClient.invalidateQueries({
				queryKey: ['reservation-stats-by-status'],
			});
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi thực hiện đặt trước');
		},
	});
};
