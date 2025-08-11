import { GradeLevelsAPI } from '@/apis/grade-levels';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseDeleteGradeLevelOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useDeleteGradeLevel = (
	options: UseDeleteGradeLevelOptions = {}
) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (id: string) => GradeLevelsAPI.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['grade-levels'] });
			toast.success('Xóa khối lớp thành công!');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi khi xóa khối lớp');
			onError?.(error);
		},
	});

	return {
		deleteGradeLevel: mutation.mutate,
		deleteGradeLevelAsync: mutation.mutateAsync,
		isDeleting: mutation.isPending,
		error: mutation.error,
	};
};
