import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AuthorsAPI } from '@/apis/authors';
import type { UpdateAuthorRequest } from '@/types/authors';
import { toast } from 'sonner';

interface UseUpdateAuthorOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useUpdateAuthor = (options: UseUpdateAuthorOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateAuthorRequest }) =>
			AuthorsAPI.update(id, data),
		onSuccess: (data) => {
			// Invalidate và refetch danh sách authors
			queryClient.invalidateQueries({ queryKey: ['authors'] });

			// Hiển thị toast thành công
			toast.success(`Cập nhật tác giả ${data.author_name} thành công!`);

			// Gọi callback onSuccess nếu có
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			// Hiển thị toast lỗi
			toast.error(error.message || 'Có lỗi xảy ra khi cập nhật tác giả');

			// Gọi callback onError nếu có
			onError?.(error);
		},
	});

	return {
		updateAuthor: mutation.mutate,
		updateAuthorAsync: mutation.mutateAsync,
		isUpdating: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
