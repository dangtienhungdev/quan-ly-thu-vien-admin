import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AuthorsAPI } from '@/apis/authors';
import type { CreateAuthorRequest } from '@/types/authors';
import { toast } from 'sonner';

interface UseCreateAuthorOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useCreateAuthor = (options: UseCreateAuthorOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: (data: CreateAuthorRequest) => AuthorsAPI.create(data),
		onSuccess: (data) => {
			// Invalidate và refetch danh sách authors
			queryClient.invalidateQueries({ queryKey: ['authors'] });

			// Hiển thị toast thành công
			toast.success(`Tạo tác giả ${data.author_name} thành công!`);

			// Gọi callback onSuccess nếu có
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			// Hiển thị toast lỗi
			toast.error(error.message || 'Có lỗi xảy ra khi tạo tác giả');

			// Gọi callback onError nếu có
			onError?.(error);
		},
	});

	return {
		createAuthor: mutation.mutate,
		createAuthorAsync: mutation.mutateAsync,
		isCreating: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
