import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReadersAPI } from '@/apis/readers';
import type { UpdateReaderRequest } from '@/types/readers';
import { toast } from 'sonner';

interface UseUpdateReaderOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useUpdateReader = (options: UseUpdateReaderOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateReaderRequest }) =>
			ReadersAPI.update(id, data),
		onSuccess: (data) => {
			// Invalidate và refetch danh sách readers
			queryClient.invalidateQueries({ queryKey: ['readers'] });
			queryClient.invalidateQueries({ queryKey: ['expired-cards'] });
			queryClient.invalidateQueries({ queryKey: ['expiring-soon'] });

			// Hiển thị toast thành công (chỉ khi không có callback onSuccess)
			if (!onSuccess) {
				toast.success(`Cập nhật độc giả ${data.fullName} thành công!`);
			}

			// Gọi callback onSuccess nếu có
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			// Hiển thị toast lỗi
			toast.error(error.message || 'Có lỗi xảy ra khi cập nhật độc giả');

			// Gọi callback onError nếu có
			onError?.(error);
		},
	});

	return {
		updateReader: mutation.mutate,
		updateReaderAsync: mutation.mutateAsync,
		isUpdating: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
