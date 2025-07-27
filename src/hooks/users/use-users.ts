import { UsersAPI } from '@/apis/users';
import type { PaginationUserQuery } from '@/types/user.type';
import { useQuery } from '@tanstack/react-query';

interface UseUsersOptions {
	params?: PaginationUserQuery;
	enabled?: boolean;
}

export const useUsers = (options: UseUsersOptions = {}) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['users', params],
		queryFn: () => UsersAPI.getAll(params),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		users: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
