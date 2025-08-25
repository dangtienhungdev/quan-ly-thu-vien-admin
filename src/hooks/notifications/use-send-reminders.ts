import type {
	SendReminderRequest,
	SendReminderResponse,
} from '@/types/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NotificationsAPI } from '@/apis/notifications';
import { toast } from 'sonner';

interface UseSendRemindersOptions {
	onSuccess?: (data: SendReminderResponse) => void;
	onError?: (error: Error) => void;
}

export const useSendReminders = (options: UseSendRemindersOptions = {}) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (data: SendReminderRequest) =>
			NotificationsAPI.sendReminders(data),
		onSuccess: (data) => {
			toast.success('Đã gửi thông báo nhắc nhở thành công!');

			// Invalidate related queries
			queryClient.invalidateQueries({ queryKey: ['near-due-books'] });
			queryClient.invalidateQueries({ queryKey: ['near-due-stats'] });
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
			queryClient.invalidateQueries({ queryKey: ['notification-stats'] });

			onSuccess?.(data);
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi gửi thông báo nhắc nhở');
			onError?.(error);
		},
	});

	return {
		sendReminders: mutation.mutate,
		sendRemindersAsync: mutation.mutateAsync,
		isSending: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
