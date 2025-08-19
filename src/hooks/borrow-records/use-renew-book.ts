import { BorrowRecordsAPI } from '@/apis/borrow-records';
import type { RenewBookRequest } from '@/types/borrow-records';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseRenewBookOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useRenewBook = (options: UseRenewBookOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: RenewBookRequest }) =>
			BorrowRecordsAPI.renewBook(id, data),
		onSuccess: (data) => {
			toast.success('Gia hạn sách thành công!');
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-overdue'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi gia hạn sách');
			onError?.(error);
		},
	});

	return {
		renewBook: mutation.mutate,
		renewBookAsync: mutation.mutateAsync,
		isRenewing: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
