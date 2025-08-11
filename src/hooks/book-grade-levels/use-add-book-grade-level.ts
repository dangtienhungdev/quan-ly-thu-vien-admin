import { BookGradeLevelsAPI } from '@/apis/book-grade-levels';
import type { BookGradeLevel } from '@/types/book-grade-levels';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseAddBookGradeLevelOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useAddBookGradeLevel = (
	options: UseAddBookGradeLevelOptions = {}
) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (data: BookGradeLevel) => BookGradeLevelsAPI.create(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['book-grade-levels', 'book', variables.book_id],
			});
			toast.success('Thêm liên kết Sách - Khối lớp thành công!');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi khi thêm liên kết');
			onError?.(error);
		},
	});

	return {
		addBookGradeLevel: mutation.mutate,
		addBookGradeLevelAsync: mutation.mutateAsync,
		isAdding: mutation.isPending,
		error: mutation.error,
	};
};
