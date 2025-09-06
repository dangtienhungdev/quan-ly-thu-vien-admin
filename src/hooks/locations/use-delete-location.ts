import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LocationsAPI } from '@/apis';
import { toast } from 'sonner';

export const useDeleteLocation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => LocationsAPI.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['locations'] });
			toast.success('Xóa vị trí thành công!');
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || 'Có lỗi xảy ra khi xóa vị trí'
			);
		},
	});
};
