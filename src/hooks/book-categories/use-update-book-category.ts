import { BookCategoriesAPI } from '@/apis/book-categories';
import type { UpdateBookCategoryRequest } from '@/types/book-categories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseUpdateBookCategoryOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useUpdateBookCategory = (
	options: UseUpdateBookCategoryOptions = {}
) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdateBookCategoryRequest;
		}) => BookCategoriesAPI.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['book-categories'] });
			toast.success('Cập nhật thể loại chi tiết thành công!');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi khi cập nhật thể loại chi tiết');
			onError?.(error);
		},
	});

	return {
		updateBookCategory: mutation.mutate,
		updateBookCategoryAsync: mutation.mutateAsync,
		isUpdating: mutation.isPending,
		error: mutation.error,
	};
};
