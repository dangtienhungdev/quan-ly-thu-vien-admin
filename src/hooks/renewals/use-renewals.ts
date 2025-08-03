import { RenewalsAPI } from '@/apis/renewals';
import { useQuery } from '@tanstack/react-query';

interface UseRenewalsOptions {
	page?: number;
	limit?: number;
	searchQuery?: string;
	enabled?: boolean;
}

export const useRenewals = (options: UseRenewalsOptions = {}) => {
	const { page = 1, limit = 10, searchQuery, enabled = true } = options;

	const query = useQuery({
		queryKey: ['renewals', { page, limit, searchQuery }],
		queryFn: () => {
			if (searchQuery) {
				return RenewalsAPI.search({ q: searchQuery, page, limit });
			}
			return RenewalsAPI.getAll({ page, limit });
		},
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
