import { ReservationsAPI } from '@/apis/reservations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useFulfillReservation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => ReservationsAPI.fulfill(id),
		onSuccess: () => {
			toast.success('Thực hiện đặt trước thành công!');
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({ queryKey: ['reservations', 'stats'] });
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi thực hiện đặt trước');
		},
	});
};
