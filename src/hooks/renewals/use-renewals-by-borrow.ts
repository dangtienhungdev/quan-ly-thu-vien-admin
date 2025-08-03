import { RenewalsAPI } from '@/apis/renewals';
import { useQuery } from '@tanstack/react-query';

interface UseRenewalsByBorrowOptions {
	borrowId: string;
	page?: number;
	limit?: number;
	enabled?: boolean;
}

export const useRenewalsByBorrow = (options: UseRenewalsByBorrowOptions) => {
	const { borrowId, page = 1, limit = 10, enabled = true } = options;

	const query = useQuery({
		queryKey: ['renewals', 'by-borrow', borrowId, { page, limit }],
		queryFn: () => RenewalsAPI.getByBorrow({ borrowId, page, limit }),
		enabled: enabled && !!borrowId,
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
