import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { UserRole } from '@/types';

export const useUserSearch = () => {
	const [queryParams] = useSearchParams();
	const navigate = useNavigate();

	const type = queryParams.get('type');
	const page = queryParams.get('page');
	const limit = queryParams.get('limit');
	const search = queryParams.get('search');

	// State cho search
	const [searchValue, setSearchValue] = useState(search || '');
	const [currentSearch, setCurrentSearch] = useState(search || '');
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Đồng bộ searchValue với URL params khi component mount
	useEffect(() => {
		setSearchValue(search || '');
		setCurrentSearch(search || '');
		setIsInitialLoad(false);
	}, [search]);

	// Cập nhật URL khi currentSearch thay đổi
	useEffect(() => {
		if (!isInitialLoad) {
			const searchParams = new URLSearchParams();
			searchParams.set('type', type || 'reader');
			searchParams.set('page', '1'); // Reset về trang 1 khi search
			if (currentSearch) {
				searchParams.set('search', currentSearch);
			}
			navigate(`?${searchParams.toString()}`, { replace: true });
		}
	}, [currentSearch, type, navigate, isInitialLoad]);

	// Hàm xử lý search - chỉ cập nhật state
	const handleSearchChange = (value: string) => {
		setSearchValue(value);
	};

	// Hàm thực hiện search
	const handleSearch = () => {
		setCurrentSearch(searchValue);
		// Giữ focus cho input
		searchInputRef.current?.focus();
	};

	// Hàm xử lý khi nhấn Enter
	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	// Hàm xử lý khi tab thay đổi
	const handleTabChange = (value: string) => {
		const newType = value === 'admin' ? 'admin' : 'reader';
		const searchParams = new URLSearchParams();
		searchParams.set('type', newType);
		searchParams.set('page', '1'); // Reset về trang 1 khi đổi tab
		if (currentSearch) {
			searchParams.set('search', currentSearch);
		}
		navigate(`?${searchParams.toString()}`);
	};

	// Hàm xử lý thay đổi trang
	const handlePageChange = (newPage: number) => {
		const searchParams = new URLSearchParams();
		searchParams.set('page', newPage.toString());
		searchParams.set('type', type || 'reader');
		if (currentSearch) {
			searchParams.set('search', currentSearch);
		}
		navigate(`?${searchParams.toString()}`);
	};

	// Build params object for API
	const buildApiParams = () => {
		const params: any = {
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 20,
		};

		if (type) {
			params.type = type as UserRole;
		}

		if (currentSearch) {
			params.search = currentSearch;
		}

		return params;
	};

	return {
		// State
		searchValue,
		currentSearch,
		searchInputRef,
		type,
		page,
		limit,

		// Handlers
		handleSearchChange,
		handleSearch,
		handleKeyPress,
		handleTabChange,
		handlePageChange,

		// Utils
		buildApiParams,
	};
};
