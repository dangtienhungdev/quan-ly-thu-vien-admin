import { BookCategoriesAPI } from '@/apis/book-categories';
import type { CreateBookCategoryRequest } from '@/types/book-categories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseCreateBookCategoryOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useCreateBookCategory = (
	options: UseCreateBookCategoryOptions = {}
) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (data: CreateBookCategoryRequest) =>
			BookCategoriesAPI.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['book-categories'] });
			toast.success('Tạo thể loại chi tiết thành công!');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi khi tạo thể loại chi tiết');
			onError?.(error);
		},
	});

	return {
		createBookCategory: mutation.mutate,
		createBookCategoryAsync: mutation.mutateAsync,
		isCreating: mutation.isPending,
		error: mutation.error,
	};
};
