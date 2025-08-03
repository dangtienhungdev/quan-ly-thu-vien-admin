import { RenewalsAPI } from '@/apis/renewals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteRenewal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => RenewalsAPI.delete(id),
		onSuccess: () => {
			toast.success('Xóa yêu cầu gia hạn thành công!');
			queryClient.invalidateQueries({ queryKey: ['renewals'] });
			queryClient.invalidateQueries({ queryKey: ['renewals', 'stats'] });
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi xóa yêu cầu gia hạn');
		},
	});
};
