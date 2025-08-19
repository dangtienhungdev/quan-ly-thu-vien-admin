import { BorrowRecordsAPI } from '@/apis/borrow-records';
import type { SendRemindersRequest } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSendReminders = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: SendRemindersRequest) =>
			BorrowRecordsAPI.sendReminders(data),
		onSuccess: (data) => {
			toast.success(data.message);
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
