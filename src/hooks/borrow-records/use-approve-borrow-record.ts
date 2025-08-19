import { BorrowRecordsAPI } from '@/apis/borrow-records';
import type { ApproveBorrowRequest } from '@/types/borrow-records';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseApproveBorrowRecordOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useApproveBorrowRecord = (
	options: UseApproveBorrowRecordOptions = {}
) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: ApproveBorrowRequest }) =>
			BorrowRecordsAPI.approve(id, data),
		onSuccess: (data) => {
			toast.success('Phê duyệt yêu cầu mượn sách thành công!');
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
			queryClient.invalidateQueries({
				queryKey: ['borrow-records-pending-approval'],
			});
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			toast.error(
				error.message || 'Có lỗi xảy ra khi phê duyệt yêu cầu mượn sách'
			);
			onError?.(error);
		},
	});

	return {
		approveBorrowRecord: mutation.mutate,
		approveBorrowRecordAsync: mutation.mutateAsync,
		isApproving: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
