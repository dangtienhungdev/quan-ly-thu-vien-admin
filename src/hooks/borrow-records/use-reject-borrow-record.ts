import { BorrowRecordsAPI } from '@/apis/borrow-records';
import type { RejectBorrowRequest } from '@/types/borrow-records';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseRejectBorrowRecordOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useRejectBorrowRecord = (
	options: UseRejectBorrowRecordOptions = {}
) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: RejectBorrowRequest }) =>
			BorrowRecordsAPI.reject(id, data),
		onSuccess: (data) => {
			toast.success('Từ chối yêu cầu mượn sách thành công!');
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
			queryClient.invalidateQueries({
				queryKey: ['borrow-records-pending-approval'],
			});
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			toast.error(
				error.message || 'Có lỗi xảy ra khi từ chối yêu cầu mượn sách'
			);
			onError?.(error);
		},
	});

	return {
		rejectBorrowRecord: mutation.mutate,
		rejectBorrowRecordAsync: mutation.mutateAsync,
		isRejecting: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
