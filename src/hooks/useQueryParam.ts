import { useSearchParams } from 'react-router-dom';

export const useQueryParams = () => {
	const [searchParams] = useSearchParams();
	const searchParamsObject = Object.fromEntries([...searchParams]);
	return searchParamsObject;
};
