import { RenewalsAPI } from '@/apis/renewals';
import type { RejectRenewalRequest } from '@/types/renewals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useRejectRenewal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: RejectRenewalRequest }) =>
			RenewalsAPI.reject(id, data),
		onSuccess: () => {
			toast.success('Từ chối gia hạn thành công!');
			queryClient.invalidateQueries({ queryKey: ['renewals'] });
			queryClient.invalidateQueries({ queryKey: ['renewals', 'stats'] });
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi từ chối gia hạn');
		},
	});
};
