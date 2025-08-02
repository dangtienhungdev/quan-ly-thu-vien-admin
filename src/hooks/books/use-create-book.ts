import { BooksAPI } from '@/apis/books';
import type { CreateBookRequest } from '@/types/books';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseCreateBookOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useCreateBook = (options: UseCreateBookOptions = {}) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (data: CreateBookRequest) => BooksAPI.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['books'] });
			toast.success('Tạo sách thành công!');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi tạo sách');
			onError?.(error);
		},
	});

	return {
		createBook: mutation.mutate,
		createBookAsync: mutation.mutateAsync,
		isCreating: mutation.isPending,
		error: mutation.error,
	};
};
