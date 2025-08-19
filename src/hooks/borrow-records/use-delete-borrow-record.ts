import { BorrowRecordsAPI } from '@/apis/borrow-records';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseDeleteBorrowRecordOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useDeleteBorrowRecord = (
	options: UseDeleteBorrowRecordOptions = {}
) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: (id: string) => BorrowRecordsAPI.delete(id),
		onSuccess: () => {
			toast.success('Xóa giao dịch thành công!');
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi xóa giao dịch');
			onError?.(error);
		},
	});

	return {
		deleteBorrowRecord: mutation.mutate,
		deleteBorrowRecordAsync: mutation.mutateAsync,
		isDeleting: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
