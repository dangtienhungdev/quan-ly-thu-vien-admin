import { RenewalsAPI } from '@/apis/renewals';
import type { ApproveRenewalRequest } from '@/types/renewals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useApproveRenewal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ApproveRenewalRequest }) =>
			RenewalsAPI.approve(id, data),
		onSuccess: () => {
			toast.success('Phê duyệt gia hạn thành công!');
			queryClient.invalidateQueries({ queryKey: ['renewals'] });
			queryClient.invalidateQueries({ queryKey: ['renewals', 'stats'] });
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi phê duyệt gia hạn');
		},
	});
};
