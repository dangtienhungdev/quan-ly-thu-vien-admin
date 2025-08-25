import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateFineRequest } from '@/types/fines';
import { FinesAPI } from '@/apis';
import { toast } from 'sonner';

interface UseCreateFineOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useCreateFine = (options: UseCreateFineOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: (data: CreateFineRequest) => FinesAPI.create(data),
		onSuccess: (data) => {
			toast.success('Tạo phiếu phạt thành công!');
			queryClient.invalidateQueries({ queryKey: ['fines'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi tạo phiếu phạt');
			onError?.(error);
		},
	});

	return {
		createFine: mutation.mutate,
		createFineAsync: mutation.mutateAsync,
		isCreating: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
