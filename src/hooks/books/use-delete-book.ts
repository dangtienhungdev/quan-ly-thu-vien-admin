import { BooksAPI } from '@/apis/books';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseDeleteBookOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useDeleteBook = (options: UseDeleteBookOptions = {}) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (id: string) => BooksAPI.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['books'] });
			toast.success('Xóa sách thành công!');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi xóa sách');
			onError?.(error);
		},
	});

	return {
		deleteBook: mutation.mutate,
		deleteBookAsync: mutation.mutateAsync,
		isDeleting: mutation.isPending,
		error: mutation.error,
	};
};
