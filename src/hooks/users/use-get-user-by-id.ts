import { UsersAPI } from '@/apis';
import { useQuery } from '@tanstack/react-query';

export const useGetUserById = (id: string, enabled: boolean = true) => {
	return useQuery({
		queryKey: ['user', id],
		queryFn: () => UsersAPI.getById(id),
		enabled: enabled && !!id,
	});
};
