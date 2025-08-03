import { RenewalsAPI } from '@/apis/renewals';
import type { UpdateRenewalRequest } from '@/types/renewals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateRenewal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateRenewalRequest }) =>
			RenewalsAPI.update(id, data),
		onSuccess: () => {
			toast.success('Cập nhật yêu cầu gia hạn thành công!');
			queryClient.invalidateQueries({ queryKey: ['renewals'] });
			queryClient.invalidateQueries({ queryKey: ['renewals', 'stats'] });
		},
		onError: (error: any) => {
			toast.error(
				error.message || 'Có lỗi xảy ra khi cập nhật yêu cầu gia hạn'
			);
		},
	});
};
