import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NotificationsAPI } from '@/apis/notifications';
import { toast } from 'sonner';

interface UseDeleteNotificationOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useDeleteNotification = (
	options: UseDeleteNotificationOptions = {}
) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (notificationId: string) =>
			NotificationsAPI.deleteNotification(notificationId),
		onSuccess: () => {
			toast.success('Đã xóa thông báo thành công!');

			// Invalidate related queries
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
			queryClient.invalidateQueries({ queryKey: ['notification-stats'] });

			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi xóa thông báo');
			onError?.(error);
		},
	});

	return {
		deleteNotification: mutation.mutate,
		deleteNotificationAsync: mutation.mutateAsync,
		isDeleting: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
