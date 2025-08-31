import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReaderTypesAPI } from '@/apis/reader-types';
import type { UpdateReaderTypeRequest } from '@/types/reader-types';
import { toast } from 'sonner';

interface UseUpdateReaderTypeOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useUpdateReaderType = (
	options: UseUpdateReaderTypeOptions = {}
) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateReaderTypeRequest }) =>
			ReaderTypesAPI.update(id, data),
		onSuccess: (data) => {
			console.log('🚀 ~ useUpdateReaderType ~ data:', data);
			// Invalidate và refetch danh sách reader types
			queryClient.invalidateQueries({ queryKey: ['reader-types'] });

			// Hiển thị toast thành công
			toast.success(`Cập nhật loại độc giả thành công!`);

			// Gọi callback onSuccess nếu có
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			// Hiển thị toast lỗi
			toast.error(error.message || 'Có lỗi xảy ra khi cập nhật loại độc giả');

			// Gọi callback onError nếu có
			onError?.(error);
		},
	});

	return {
		updateReaderType: mutation.mutate,
		updateReaderTypeAsync: mutation.mutateAsync,
		isUpdating: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
