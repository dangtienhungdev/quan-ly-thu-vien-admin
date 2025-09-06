import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateLocationData } from '@/types';
import { LocationsAPI } from '@/apis';
import { toast } from 'sonner';

export const useCreateLocation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateLocationData) => LocationsAPI.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['locations'] });
			toast.success('Tạo vị trí thành công!');
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || 'Có lỗi xảy ra khi tạo vị trí'
			);
		},
	});
};
