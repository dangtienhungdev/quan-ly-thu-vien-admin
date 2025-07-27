import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PublishersAPI } from '@/apis/publishers';
import { toast } from 'sonner';

interface UseTogglePublisherStatusOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useTogglePublisherStatus = (
	options: UseTogglePublisherStatusOptions = {}
) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: (id: string) => PublishersAPI.toggleStatus(id),
		onSuccess: (data) => {
			// Invalidate và refetch danh sách publishers
			queryClient.invalidateQueries({ queryKey: ['publishers'] });
			queryClient.invalidateQueries({ queryKey: ['publisher-stats'] });

			// Hiển thị toast thành công
			const status = data.isActive ? 'kích hoạt' : 'vô hiệu hóa';
			toast.success(`Đã ${status} nhà xuất bản ${data.publisherName}!`);

			// Gọi callback onSuccess nếu có
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			// Hiển thị toast lỗi
			toast.error(
				error.message || 'Có lỗi xảy ra khi thay đổi trạng thái nhà xuất bản'
			);

			// Gọi callback onError nếu có
			onError?.(error);
		},
	});

	return {
		toggleStatus: mutation.mutate,
		toggleStatusAsync: mutation.mutateAsync,
		isToggling: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
