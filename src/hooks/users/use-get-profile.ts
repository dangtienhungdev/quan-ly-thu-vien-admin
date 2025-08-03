import { UsersAPI } from '@/apis';
import { useQuery } from '@tanstack/react-query';

export const useGetProfile = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['profile'],
		queryFn: UsersAPI.getMe,
	});

	return { data, isLoading, error };
};
