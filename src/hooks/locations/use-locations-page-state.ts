import { useCallback, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

export const useLocationsPageState = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	// UI States
	const [openCreateSheet, setOpenCreateSheet] = useState(false);
	const [openEditSheet, setOpenEditSheet] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<any>(null);

	// Search and pagination
	const search = searchParams.get('q') || '';
	const page = parseInt(searchParams.get('page') || '1');
	const limit = parseInt(searchParams.get('limit') || '10');

	const setSearch = useCallback(
		(newSearch: string) => {
			setSearchParams((prev) => {
				const newParams = new URLSearchParams(prev);
				if (newSearch) {
					newParams.set('q', newSearch);
				} else {
					newParams.delete('q');
				}
				newParams.set('page', '1'); // Reset to first page when searching
				return newParams;
			});
		},
		[setSearchParams]
	);

	const setPage = useCallback(
		(newPage: number) => {
			setSearchParams((prev) => {
				const newParams = new URLSearchParams(prev);
				newParams.set('page', newPage.toString());
				return newParams;
			});
		},
		[setSearchParams]
	);

	const setLimit = useCallback(
		(newLimit: number) => {
			setSearchParams((prev) => {
				const newParams = new URLSearchParams(prev);
				newParams.set('limit', newLimit.toString());
				newParams.set('page', '1'); // Reset to first page when changing limit
				return newParams;
			});
		},
		[setSearchParams]
	);

	// Sheet handlers
	const openCreateSheetHandler = useCallback(() => {
		setOpenCreateSheet(true);
	}, []);

	const closeCreateSheet = useCallback(() => {
		setOpenCreateSheet(false);
	}, []);

	const openEditSheetHandler = useCallback((location: any) => {
		setSelectedLocation(location);
		setOpenEditSheet(true);
	}, []);

	const closeEditSheet = useCallback(() => {
		setOpenEditSheet(false);
		setSelectedLocation(null);
	}, []);

	// Delete dialog handlers
	const openDeleteDialogHandler = useCallback((location: any) => {
		setSelectedLocation(location);
		setOpenDeleteDialog(true);
	}, []);

	const closeDeleteDialog = useCallback(() => {
		setOpenDeleteDialog(false);
		setSelectedLocation(null);
	}, []);

	return {
		// Search and pagination
		search,
		page,
		limit,
		setSearch,
		setPage,
		setLimit,

		// UI States
		openCreateSheet,
		openEditSheet,
		openDeleteDialog,
		selectedLocation,

		// Handlers
		openCreateSheetHandler,
		closeCreateSheet,
		openEditSheetHandler,
		closeEditSheet,
		openDeleteDialogHandler,
		closeDeleteDialog,
	};
};
