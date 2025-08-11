import { BookGradeLevelsAPI } from '@/apis/book-grade-levels';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseRemoveBookGradeLevelOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useRemoveBookGradeLevel = (
	options: UseRemoveBookGradeLevelOptions = {}
) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({
			bookId,
			gradeLevelId,
		}: {
			bookId: string;
			gradeLevelId: string;
		}) => BookGradeLevelsAPI.remove(bookId, gradeLevelId),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['book-grade-levels', 'book', variables.bookId],
			});
			toast.success('Xóa liên kết Sách - Khối lớp thành công!');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi khi xóa liên kết');
			onError?.(error);
		},
	});

	return {
		removeBookGradeLevel: mutation.mutate,
		removeBookGradeLevelAsync: mutation.mutateAsync,
		isRemoving: mutation.isPending,
		error: mutation.error,
	};
};
