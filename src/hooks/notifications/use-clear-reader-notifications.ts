import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NotificationsAPI } from '@/apis/notifications';
import { toast } from 'sonner';

interface UseClearReaderNotificationsOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useClearReaderNotifications = (
	options: UseClearReaderNotificationsOptions = {}
) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (readerId: string) =>
			NotificationsAPI.clearReaderNotifications(readerId),
		onSuccess: () => {
			toast.success('Đã xóa tất cả thông báo của độc giả thành công!');

			// Invalidate related queries
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
			queryClient.invalidateQueries({ queryKey: ['notification-stats'] });

			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(
				error.message || 'Có lỗi xảy ra khi xóa thông báo của độc giả'
			);
			onError?.(error);
		},
	});

	return {
		clearReaderNotifications: mutation.mutate,
		clearReaderNotificationsAsync: mutation.mutateAsync,
		isClearing: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
