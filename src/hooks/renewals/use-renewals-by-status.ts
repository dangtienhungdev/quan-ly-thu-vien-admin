import { RenewalsAPI } from '@/apis/renewals';
import type { RenewalStatus } from '@/types/renewals';
import { useQuery } from '@tanstack/react-query';

interface UseRenewalsByStatusOptions {
	status: RenewalStatus;
	page?: number;
	limit?: number;
	enabled?: boolean;
}

export const useRenewalsByStatus = (options: UseRenewalsByStatusOptions) => {
	const { status, page = 1, limit = 10, enabled = true } = options;

	const query = useQuery({
		queryKey: ['renewals', 'status', status, { page, limit }],
		queryFn: () => RenewalsAPI.getByStatus({ status, page, limit }),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		renewals: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
