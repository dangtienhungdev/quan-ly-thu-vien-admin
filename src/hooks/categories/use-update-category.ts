import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CategoriesAPI } from '@/apis/categories';
import type { UpdateCategoryRequest } from '@/types/categories';
import { toast } from 'sonner';

interface UseUpdateCategoryOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useUpdateCategory = (options: UseUpdateCategoryOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
			CategoriesAPI.update(id, data),
		onSuccess: (data) => {
			// Invalidate và refetch danh sách categories
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			queryClient.invalidateQueries({ queryKey: ['main-categories'] });

			// Hiển thị toast thành công
			toast.success(`Cập nhật danh mục ${data.category_name} thành công!`);

			// Gọi callback onSuccess nếu có
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			// Hiển thị toast lỗi
			toast.error(error.message || 'Có lỗi xảy ra khi cập nhật danh mục');

			// Gọi callback onError nếu có
			onError?.(error);
		},
	});

	return {
		updateCategory: mutation.mutate,
		updateCategoryAsync: mutation.mutateAsync,
		isUpdating: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
