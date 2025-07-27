import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UsersAPI } from '@/apis/users';
import type { UpdateUserRequest } from '@/types/user.type';
import { toast } from 'sonner';

interface UseUpdateUserOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
}

export const useUpdateUser = (options: UseUpdateUserOptions = {}) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
			UsersAPI.update(id, data),
		onSuccess: (data) => {
			// Invalidate và refetch danh sách users
			queryClient.invalidateQueries({ queryKey: ['users'] });

			// Hiển thị toast thành công
			toast.success(`Cập nhật người dùng ${data.userCode} thành công!`);

			// Gọi callback onSuccess nếu có
			onSuccess?.(data);
		},
		onError: (error: Error) => {
			// Hiển thị toast lỗi
			toast.error(error.message || 'Có lỗi xảy ra khi cập nhật người dùng');

			// Gọi callback onError nếu có
			onError?.(error);
		},
	});

	return {
		updateUser: mutation.mutate,
		updateUserAsync: mutation.mutateAsync,
		isUpdating: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
