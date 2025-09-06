import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LocationsAPI } from '@/apis';
import type { UpdateLocationData } from '@/types';
import { toast } from 'sonner';

export const useUpdateLocation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateLocationData }) =>
			LocationsAPI.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['locations'] });
			toast.success('Cập nhật vị trí thành công!');
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật vị trí'
			);
		},
	});
};
