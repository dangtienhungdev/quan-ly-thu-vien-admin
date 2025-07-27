import { UsersAPI } from '@/apis/users';
import { useQuery } from '@tanstack/react-query';

interface UseUsersDropdownOptions {
	enabled?: boolean;
}

export const useUsersDropdown = (options: UseUsersDropdownOptions = {}) => {
	const { enabled = true } = options;

	const query = useQuery({
		queryKey: ['users-dropdown'],
		queryFn: () => UsersAPI.getAll({ limit: 1000 }),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		users: query.data?.data || [],
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
