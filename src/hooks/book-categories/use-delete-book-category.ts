import { BookCategoriesAPI } from '@/apis/book-categories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseDeleteBookCategoryOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useDeleteBookCategory = (
	options: UseDeleteBookCategoryOptions = {}
) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (id: string) => BookCategoriesAPI.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['book-categories'] });
			toast.success('Xóa thể loại chi tiết thành công!');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi khi xóa thể loại chi tiết');
			onError?.(error);
		},
	});

	return {
		deleteBookCategory: mutation.mutate,
		deleteBookCategoryAsync: mutation.mutateAsync,
		isDeleting: mutation.isPending,
		error: mutation.error,
	};
};
