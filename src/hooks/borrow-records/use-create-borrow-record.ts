import { BorrowRecordsAPI } from '@/apis/borrow-records';
import type { CreateBorrowRecordRequest } from '@/types/borrow-records';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseCreateBorrowRecordOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useCreateBorrowRecord = (
	options: UseCreateBorrowRecordOptions = {}
) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: (data: CreateBorrowRecordRequest) =>
			BorrowRecordsAPI.create(data),
		onSuccess: (data) => {
			toast.success('Tạo giao dịch mượn thành công!');
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
			queryClient.invalidateQueries({
				queryKey: ['borrow-records-pending-approval'],
			});
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi tạo giao dịch mượn');
			onError?.(error);
		},
	});

	return {
		createBorrowRecord: mutation.mutate,
		createBorrowRecordAsync: mutation.mutateAsync,
		isCreating: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
