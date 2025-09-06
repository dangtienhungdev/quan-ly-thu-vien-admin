import { LocationsAPI } from '@/apis';
import { useQuery } from '@tanstack/react-query';

export const useActiveLocations = () => {
	return useQuery({
		queryKey: ['locations', 'active'],
		queryFn: () => LocationsAPI.getActiveLocations(),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};
