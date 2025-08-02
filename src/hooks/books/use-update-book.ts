import { BooksAPI } from '@/apis/books';
import type { UpdateBookRequest } from '@/types/books';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseUpdateBookOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useUpdateBook = (options: UseUpdateBookOptions = {}) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateBookRequest }) =>
			BooksAPI.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['books'] });
			toast.success('Cập nhật sách thành công!');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi cập nhật sách');
			onError?.(error);
		},
	});

	return {
		updateBook: mutation.mutate,
		updateBookAsync: mutation.mutateAsync,
		isUpdating: mutation.isPending,
		error: mutation.error,
	};
};
