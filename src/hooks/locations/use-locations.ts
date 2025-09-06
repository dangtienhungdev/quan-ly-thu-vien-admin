import type { LocationSearchParams } from '@/types';
import { LocationsAPI } from '@/apis';
import { useQuery } from '@tanstack/react-query';

export const useLocations = (params: LocationSearchParams = {}) => {
	const { q, ...otherParams } = params;

	return useQuery({
		queryKey: ['locations', params],
		queryFn: () => {
			if (q) {
				return LocationsAPI.search({ q, ...otherParams });
			}
			return LocationsAPI.getAll(otherParams);
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};
