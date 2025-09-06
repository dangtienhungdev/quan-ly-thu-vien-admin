import type { PaginationAuthorQuery, SearchAuthorQuery } from '@/types/authors';

import { AuthorsAPI } from '@/apis/authors';
import { useQuery } from '@tanstack/react-query';

interface UseAuthorsOptions {
	params?: PaginationAuthorQuery;
	enabled?: boolean;
}

export const useAuthors = (options: UseAuthorsOptions = {}) => {
	const { params, enabled = true } = options;

	// Determine which API to use based on search query
	const hasSearchQuery = params?.q && params.q.trim() !== '';

	const query = useQuery({
		queryKey: ['authors', params],
		queryFn: () => {
			if (hasSearchQuery) {
				// Use search API when there's a search query
				const searchParams: SearchAuthorQuery = {
					q: params.q!,
					page: params.page || 1,
					limit: params.limit || 10,
				};
				return AuthorsAPI.search(searchParams);
			} else {
				// Use regular getAll API without search query
				const paginationParams = params
					? { page: params.page, limit: params.limit }
					: undefined;
				return AuthorsAPI.getAll(paginationParams);
			}
		},
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
