import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PublishersAPI } from '@/apis/publishers';
import { toast } from 'sonner';

interface UseDeletePublisherOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useDeletePublisher = (options: UseDeletePublisherOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: (id: string) => PublishersAPI.delete(id),
		onSuccess: (_, id) => {
			// Invalidate and refetch publishers list
			queryClient.invalidateQueries({ queryKey: ['publishers'] });
			queryClient.invalidateQueries({ queryKey: ['publisher-stats'] });

			toast.success('Xóa nhà xuất bản thành công!');

			onSuccess?.();
		},
		onError: (error: Error) => {
			const errorMessage =
				error.message || 'Có lỗi xảy ra khi xóa nhà xuất bản';
			toast.error(errorMessage);
			onError?.(error);
		},
	});

	return {
		deletePublisher: mutation.mutate,
		isDeleting: mutation.isPending,
		error: mutation.error,
	};
};
