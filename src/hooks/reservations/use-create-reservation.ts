import { ReservationsAPI } from '@/apis/reservations';
import type { CreateReservationRequest } from '@/types/reservations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateReservation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateReservationRequest) =>
			ReservationsAPI.create(data),
		onSuccess: () => {
			toast.success('Tạo đặt trước thành công!');
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({ queryKey: ['reservations', 'stats'] });
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi tạo đặt trước');
		},
	});
};
