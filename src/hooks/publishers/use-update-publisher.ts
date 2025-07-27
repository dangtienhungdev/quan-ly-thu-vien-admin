import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PublishersAPI } from '@/apis/publishers';
import type { UpdatePublisherRequest } from '@/types/publishers';
import { toast } from 'sonner';

interface UseUpdatePublisherOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useUpdatePublisher = (options: UseUpdatePublisherOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdatePublisherRequest }) =>
			PublishersAPI.update(id, data),
		onSuccess: (data) => {
			// Invalidate và refetch danh sách publishers
			queryClient.invalidateQueries({ queryKey: ['publishers'] });
			queryClient.invalidateQueries({ queryKey: ['publisher-stats'] });

			// Hiển thị toast thành công
			toast.success(`Cập nhật nhà xuất bản ${data.publisherName} thành công!`);

			// Gọi callback onSuccess nếu có
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			// Hiển thị toast lỗi
			toast.error(error.message || 'Có lỗi xảy ra khi cập nhật nhà xuất bản');

			// Gọi callback onError nếu có
			onError?.(error);
		},
	});

	return {
		updatePublisher: mutation.mutate,
		updatePublisherAsync: mutation.mutateAsync,
		isUpdating: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
