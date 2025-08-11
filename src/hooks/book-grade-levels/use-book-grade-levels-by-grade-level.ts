import { BookGradeLevelsAPI } from '@/apis/book-grade-levels';
import { useQuery } from '@tanstack/react-query';

export const useBookGradeLevelsByGradeLevel = (
	gradeLevelId: string | undefined,
	enabled: boolean = true
) => {
	const query = useQuery({
		queryKey: ['book-grade-levels', 'grade-level', gradeLevelId],
		queryFn: () => BookGradeLevelsAPI.getByGradeLevel(gradeLevelId as string),
		enabled: enabled && !!gradeLevelId,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

	return {
		mappings: query.data || [],
		isLoading: query.isPending,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
};
