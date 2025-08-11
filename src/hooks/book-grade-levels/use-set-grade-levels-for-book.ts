import { BookGradeLevelsAPI } from '@/apis/book-grade-levels';
import type { SetGradeLevelsForBookRequest } from '@/types/book-grade-levels';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseSetGradeLevelsForBookOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useSetGradeLevelsForBook = (
	options: UseSetGradeLevelsForBookOptions = {}
) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (data: SetGradeLevelsForBookRequest) =>
			BookGradeLevelsAPI.setForBook(data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ['book-grade-levels', 'book', data.book_id],
			});
			toast.success('Thiết lập Khối lớp cho Sách thành công!');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi khi thiết lập Khối lớp cho Sách');
			onError?.(error);
		},
	});

	return {
		setGradeLevelsForBook: mutation.mutate,
		setGradeLevelsForBookAsync: mutation.mutateAsync,
		isSetting: mutation.isPending,
		error: mutation.error,
	};
};
