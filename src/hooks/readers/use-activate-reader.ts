import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReadersAPI } from '@/apis/readers';
import { toast } from 'sonner';

interface UseActivateReaderOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useActivateReader = (options: UseActivateReaderOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: (id: string) => ReadersAPI.activate(id),
		onSuccess: (data) => {
			// Invalidate và refetch danh sách readers
			queryClient.invalidateQueries({ queryKey: ['readers'] });
			queryClient.invalidateQueries({ queryKey: ['expired-cards'] });
			queryClient.invalidateQueries({ queryKey: ['expiring-soon'] });

			// Hiển thị toast thành công
			toast.success(`Đã kích hoạt thẻ độc giả ${data.fullName}!`);

			// Gọi callback onSuccess nếu có
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			// Hiển thị toast lỗi
			toast.error(error.message || 'Có lỗi xảy ra khi kích hoạt thẻ độc giả');

			// Gọi callback onError nếu có
			onError?.(error);
		},
	});

	return {
		activateReader: mutation.mutate,
		activateReaderAsync: mutation.mutateAsync,
		isActivating: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
