import { ReadersAPI } from '@/apis';
import { useQuery } from '@tanstack/react-query';

export const useReaderByUserId = (userId: string) => {
	return useQuery({
		queryKey: ['readers', 'by-user-id', userId],
		queryFn: () => ReadersAPI.getByUserId(userId),
		staleTime: 10 * 60 * 1000, // 10 minutes
		enabled: !!userId,
	});
};
