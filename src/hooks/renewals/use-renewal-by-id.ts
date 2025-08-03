import { RenewalsAPI } from '@/apis/renewals';
import { useQuery } from '@tanstack/react-query';

interface UseRenewalByIdOptions {
	id: string;
	enabled?: boolean;
}

export const useRenewalById = (options: UseRenewalByIdOptions) => {
	const { id, enabled = true } = options;

	const query = useQuery({
		queryKey: ['renewals', 'by-id', id],
		queryFn: () => RenewalsAPI.getById(id),
		enabled: enabled && !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		renewal: query.data,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
