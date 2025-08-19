import { BorrowRecordsAPI } from '@/apis/borrow-records';
import type { ReturnBookRequest } from '@/types/borrow-records';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseReturnBookOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useReturnBook = (options: UseReturnBookOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: ReturnBookRequest }) =>
			BorrowRecordsAPI.returnBook(id, data),
		onSuccess: (data) => {
			toast.success('Trả sách thành công!');
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-overdue'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi trả sách');
			onError?.(error);
		},
	});

	return {
		returnBook: mutation.mutate,
		returnBookAsync: mutation.mutateAsync,
		isReturning: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
