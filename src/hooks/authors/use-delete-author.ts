import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AuthorsAPI } from '@/apis/authors';
import { toast } from 'sonner';

interface UseDeleteAuthorOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useDeleteAuthor = (options: UseDeleteAuthorOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: (id: string) => AuthorsAPI.delete(id),
		onSuccess: (data) => {
			// Invalidate và refetch danh sách authors
			queryClient.invalidateQueries({ queryKey: ['authors'] });

			// Hiển thị toast thành công
			toast.success('Xóa tác giả thành công!');

			// Gọi callback onSuccess nếu có
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			// Hiển thị toast lỗi
			toast.error(error.message || 'Có lỗi xảy ra khi xóa tác giả');

			// Gọi callback onError nếu có
			onError?.(error);
		},
	});

	return {
		deleteAuthor: mutation.mutate,
		deleteAuthorAsync: mutation.mutateAsync,
		isDeleting: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
