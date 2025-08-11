import { GradeLevelsAPI } from '@/apis/grade-levels';
import type { UpdateGradeLevelRequest } from '@/types/grade-levels';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseUpdateGradeLevelOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useUpdateGradeLevel = (
	options: UseUpdateGradeLevelOptions = {}
) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateGradeLevelRequest }) =>
			GradeLevelsAPI.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['grade-levels'] });
			toast.success('Cập nhật khối lớp thành công!');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi khi cập nhật khối lớp');
			onError?.(error);
		},
	});

	return {
		updateGradeLevel: mutation.mutate,
		updateGradeLevelAsync: mutation.mutateAsync,
		isUpdating: mutation.isPending,
		error: mutation.error,
	};
};
