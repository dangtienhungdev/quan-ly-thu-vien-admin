import { RenewalsAPI } from '@/apis/renewals';
import type { CreateRenewalRequest } from '@/types/renewals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateRenewal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateRenewalRequest) => RenewalsAPI.create(data),
		onSuccess: () => {
			toast.success('Tạo yêu cầu gia hạn thành công!');
			queryClient.invalidateQueries({ queryKey: ['renewals'] });
			queryClient.invalidateQueries({ queryKey: ['renewals', 'stats'] });
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi tạo yêu cầu gia hạn');
		},
	});
};
