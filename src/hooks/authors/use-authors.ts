import { AuthorsAPI } from '@/apis/authors';
import type { PaginationAuthorQuery } from '@/types/authors';
import { useQuery } from '@tanstack/react-query';

interface UseAuthorsOptions {
	params?: PaginationAuthorQuery;
	enabled?: boolean;
}

export const useAuthors = (options: UseAuthorsOptions = {}) => {
	const { params, enabled = true } = options;

	const query = useQuery({
		queryKey: ['authors', params],
		queryFn: () => AuthorsAPI.getAll(params),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		authors: query.data?.data || [],
		meta: query.data?.meta,
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
