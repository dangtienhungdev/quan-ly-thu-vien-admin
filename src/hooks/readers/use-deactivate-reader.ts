import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReadersAPI } from '@/apis/readers';
import { toast } from 'sonner';

interface UseDeactivateReaderOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useDeactivateReader = (
	options: UseDeactivateReaderOptions = {}
) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: (id: string) => ReadersAPI.deactivate(id),
		onSuccess: (data) => {
			// Invalidate và refetch danh sách readers
			queryClient.invalidateQueries({ queryKey: ['readers'] });
			queryClient.invalidateQueries({ queryKey: ['expired-cards'] });
			queryClient.invalidateQueries({ queryKey: ['expiring-soon'] });

			// Hiển thị toast thành công
			toast.success(`Đã vô hiệu hóa thẻ độc giả ${data.fullName}!`);

			// Gọi callback onSuccess nếu có
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			// Hiển thị toast lỗi
			toast.error(error.message || 'Có lỗi xảy ra khi vô hiệu hóa thẻ độc giả');

			// Gọi callback onError nếu có
			onError?.(error);
		},
	});

	return {
		deactivateReader: mutation.mutate,
		deactivateReaderAsync: mutation.mutateAsync,
		isDeactivating: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
