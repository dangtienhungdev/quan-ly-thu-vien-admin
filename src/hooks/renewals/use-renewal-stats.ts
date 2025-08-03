import { RenewalsAPI } from '@/apis/renewals';
import { useQuery } from '@tanstack/react-query';

export const useRenewalStats = () => {
	const query = useQuery({
		queryKey: ['renewals', 'stats'],
		queryFn: () => RenewalsAPI.getStats(),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		stats: query.data,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
