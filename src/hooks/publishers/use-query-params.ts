import { useSearchParams } from 'react-router-dom';

export const useQueryParams = () => {
	const [searchParams] = useSearchParams();

	const page = searchParams.get('page');
	const limit = searchParams.get('limit');
	const search = searchParams.get('search');

	return {
		page: page ? Number(page) : 1,
		limit: limit ? Number(limit) : 10,
		search: search || '',
	};
};
