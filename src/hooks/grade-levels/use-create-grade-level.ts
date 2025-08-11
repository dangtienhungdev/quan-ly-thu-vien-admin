import { GradeLevelsAPI } from '@/apis/grade-levels';
import type { CreateGradeLevelRequest } from '@/types/grade-levels';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseCreateGradeLevelOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useCreateGradeLevel = (
	options: UseCreateGradeLevelOptions = {}
) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (data: CreateGradeLevelRequest) => GradeLevelsAPI.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['grade-levels'] });
			toast.success('Tạo khối lớp thành công!');
			onSuccess?.();
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi khi tạo khối lớp');
			onError?.(error);
		},
	});

	return {
		createGradeLevel: mutation.mutate,
		createGradeLevelAsync: mutation.mutateAsync,
		isCreating: mutation.isPending,
		error: mutation.error,
	};
};
