import { ReservationsAPI } from '@/apis/reservations';
import type { UpdateReservationRequest } from '@/types/reservations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateReservation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateReservationRequest;
		}) => ReservationsAPI.update(id, data),
		onSuccess: () => {
			toast.success('Cập nhật đặt trước thành công!');
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({ queryKey: ['reservations', 'stats'] });
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi cập nhật đặt trước');
		},
	});
};
