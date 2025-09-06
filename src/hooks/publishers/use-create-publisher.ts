import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PublishersAPI } from '@/apis/publishers';
import type { CreatePublisherRequest } from '@/types/publishers';
import { toast } from 'sonner';

interface UseCreatePublisherOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useCreatePublisher = (options: UseCreatePublisherOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: (data: CreatePublisherRequest) => PublishersAPI.create(data),
		onSuccess: (newPublisher) => {
			// Invalidate and refetch publishers list
			queryClient.invalidateQueries({ queryKey: ['publishers'] });
			queryClient.invalidateQueries({ queryKey: ['publisher-stats'] });

			toast.success(
				`Tạo nhà xuất bản ${newPublisher.publisherName} thành công!`
			);

			onSuccess?.();
		},
		onError: (error: Error) => {
			const errorMessage =
				error.message || 'Có lỗi xảy ra khi tạo nhà xuất bản';
			toast.error(errorMessage);
			onError?.(error);
		},
	});

	return {
		createPublisher: mutation.mutate,
		isCreating: mutation.isPending,
		error: mutation.error,
	};
};
