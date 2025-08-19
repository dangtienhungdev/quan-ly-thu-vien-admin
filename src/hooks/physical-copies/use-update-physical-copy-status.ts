import { PhysicalCopiesAPI } from '@/apis/physical-copies';
import type { UpdateCopyStatusRequest } from '@/types/physical-copies';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseUpdatePhysicalCopyStatusOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useUpdatePhysicalCopyStatus = (
	options: UseUpdatePhysicalCopyStatusOptions = {}
) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateCopyStatusRequest }) =>
			PhysicalCopiesAPI.updateStatus(id, data),
		onSuccess: () => {
			// Invalidate and refetch physical copies queries
			queryClient.invalidateQueries({ queryKey: ['physical-copies'] });
			queryClient.invalidateQueries({ queryKey: ['physical-copies-stats'] });

			toast.success('Cập nhật trạng thái bản sao thành công');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(
				error.message || 'Có lỗi xảy ra khi cập nhật trạng thái bản sao'
			);
			onError?.(error);
		},
	});
};
