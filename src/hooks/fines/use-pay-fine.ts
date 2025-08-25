import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FinesAPI } from '@/apis/fines';
import { toast } from 'sonner';

interface PayFineData {
	amount: number;
	paymentMethod: string;
	transactionId?: string;
}

interface UsePayFineOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const usePayFine = (options: UsePayFineOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: PayFineData }) =>
			FinesAPI.payFine(id, data),
		onSuccess: (data) => {
			toast.success('Thanh toán phạt thành công!');
			queryClient.invalidateQueries({ queryKey: ['fines'] });
			queryClient.invalidateQueries({ queryKey: ['fines-stats'] });
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			console.error('Pay fine error:', error);
			toast.error(error.message || 'Có lỗi xảy ra khi thanh toán phạt');
			onError?.(error);
		},
	});

	return {
		payFine: mutation.mutate,
		payFineAsync: mutation.mutateAsync,
		isPaying: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
