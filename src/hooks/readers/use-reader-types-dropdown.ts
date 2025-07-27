import { ReaderTypesAPI } from '@/apis/reader-types';
import { useQuery } from '@tanstack/react-query';

interface UseReaderTypesDropdownOptions {
	enabled?: boolean;
}

export const useReaderTypesDropdown = (
	options: UseReaderTypesDropdownOptions = {}
) => {
	const { enabled = true } = options;

	const query = useQuery({
		queryKey: ['reader-types-dropdown'],
		queryFn: () => ReaderTypesAPI.getAll({ limit: 100 }),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		readerTypes: query.data?.data || [],
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
