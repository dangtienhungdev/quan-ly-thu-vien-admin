import {
	useCreatePublisher,
	useDeletePublisher,
	usePublisherStats,
	usePublishers,
	usePublishersPageState,
	useQueryParams,
	useTogglePublisherStatus,
	useUpdatePublisher,
} from '@/hooks/publishers';
import type {
	CreatePublisherRequest,
	UpdatePublisherRequest,
} from '@/types/publishers';
import { useCallback, useEffect, useState } from 'react';

import PaginationWrapper from '@/components/pagination-wrapper';
import { useNavigate } from 'react-router-dom';
import DeletePublisherDialog from './components/delete-publisher-dialog';
import EditPublisherSheet from './components/edit-publisher-sheet';
import PublishersErrorState from './components/publishers-error-state';
import PublishersLoadingSkeleton from './components/publishers-loading-skeleton';
import PublishersPageHeader from './components/publishers-page-header';
import PublishersSearch from './components/publishers-search';
import PublishersStats from './components/publishers-stats';
import PublishersTable from './components/publishers-table';

const PublishersPage = () => {
	const navigate = useNavigate();
	const { page, limit, search } = useQueryParams();

	// State cho search
	const [searchValue, setSearchValue] = useState(search);
	const [currentSearch, setCurrentSearch] = useState(search);

	// Đồng bộ searchValue với URL params
	useEffect(() => {
		setSearchValue(search);
		setCurrentSearch(search);
	}, [search]);

	// Cập nhật URL khi currentSearch thay đổi
	useEffect(() => {
		const searchParams = new URLSearchParams();
		searchParams.set('page', '1'); // Reset về trang 1 khi search
		if (currentSearch) {
			searchParams.set('search', currentSearch);
		}
		navigate(`?${searchParams.toString()}`, { replace: true });
	}, [currentSearch, navigate]);

	// Custom hooks cho state management
	const {
		isCreateSheetOpen,
		openCreateSheet,
		closeCreateSheet,
		isCreating,
		isDeleteDialogOpen,
		openDeleteDialog,
		closeDeleteDialog,
		isDeleting,
		publisherToDelete,
		isEditSheetOpen,
		openEditSheet,
		closeEditSheet,
		publisherToEdit,
	} = usePublishersPageState();

	// Custom hooks cho mutations
	const { createPublisher } = useCreatePublisher({
		onSuccess: () => {
			closeCreateSheet();
		},
	});

	const { deletePublisher } = useDeletePublisher({
		onSuccess: () => {
			closeDeleteDialog();
		},
	});

	const { updatePublisher, isUpdating } = useUpdatePublisher({
		onSuccess: () => {
			closeEditSheet();
		},
	});

	// Hook để toggle status
	const { toggleStatus, isToggling } = useTogglePublisherStatus();

	const params: {
		page: number;
		limit: number;
		search?: string;
	} = {
		page,
		limit,
	};

	if (currentSearch) {
		params.search = currentSearch;
	}

	const { publishers, meta, isLoading, isError, error, refetch } =
		usePublishers({
			params,
		});

	// Hook để lấy thống kê
	const { stats } = usePublisherStats();

	// Event handlers với useCallback
	const handleSearchChange = useCallback((value: string) => {
		setSearchValue(value);
	}, []);

	const handleSearch = useCallback(() => {
		setCurrentSearch(searchValue);
	}, [searchValue]);

	const handleCreatePublisher = useCallback(
		(data: CreatePublisherRequest) => {
			createPublisher(data);
		},
		[createPublisher]
	);

	const handleCreateSheetOpenChange = useCallback(
		(open: boolean) => {
			if (open) {
				openCreateSheet();
			} else {
				closeCreateSheet();
			}
		},
		[openCreateSheet, closeCreateSheet]
	);

	const handleDeletePublisher = useCallback(() => {
		if (publisherToDelete) {
			deletePublisher(publisherToDelete.id);
		}
	}, [deletePublisher, publisherToDelete]);

	const handleUpdatePublisher = useCallback(
		(data: UpdatePublisherRequest) => {
			if (publisherToEdit) {
				updatePublisher({ id: publisherToEdit.id, data });
			}
		},
		[updatePublisher, publisherToEdit]
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			const searchParams = new URLSearchParams();
			searchParams.set('page', newPage.toString());
			if (currentSearch) {
				searchParams.set('search', currentSearch);
			}
			navigate(`?${searchParams.toString()}`);
		},
		[currentSearch, navigate]
	);

	const handleToggleStatus = useCallback(
		(publisher: { id: string }) => {
			toggleStatus(publisher.id);
		},
		[toggleStatus]
	);

	if (isLoading) {
		return <PublishersLoadingSkeleton />;
	}

	if (isError) {
		return <PublishersErrorState error={error} onRetry={refetch} />;
	}

	return (
		<>
			<PublishersPageHeader
				onCreatePublisher={handleCreatePublisher}
				onCreateSheetOpenChange={handleCreateSheetOpenChange}
				isCreateSheetOpen={isCreateSheetOpen}
				isCreating={isCreating}
			/>

			<PublishersSearch
				searchValue={searchValue}
				onSearchChange={handleSearchChange}
				onSearch={handleSearch}
				currentSearch={currentSearch}
			/>

			{stats && <PublishersStats stats={stats} />}

			<div>
				<PublishersTable
					publishers={publishers}
					currentSearch={currentSearch}
					onToggleStatus={handleToggleStatus}
					onEdit={openEditSheet}
					onDelete={openDeleteDialog}
					isToggling={isToggling}
				/>

				{meta && (
					<div className="mt-4 space-y-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground text-center">
							Hiển thị {publishers.length} trên {meta.totalItems} nhà xuất bản
							{meta.totalPages > 1 && (
								<span>
									{' '}
									(Trang {meta.page} trên {meta.totalPages})
								</span>
							)}
						</div>

						<div>
							{meta.totalPages > 1 && (
								<PaginationWrapper
									currentPage={meta.page}
									totalPages={meta.totalPages}
									onPageChange={handlePageChange}
								/>
							)}
						</div>
					</div>
				)}
			</div>

			<DeletePublisherDialog
				isOpen={isDeleteDialogOpen}
				onOpenChange={closeDeleteDialog}
				publisherToDelete={publisherToDelete}
				onConfirm={handleDeletePublisher}
				isDeleting={isDeleting}
			/>

			<EditPublisherSheet
				isOpen={isEditSheetOpen}
				onOpenChange={closeEditSheet}
				publisherToEdit={publisherToEdit}
				onUpdate={handleUpdatePublisher}
				isUpdating={isUpdating}
			/>
		</>
	);
};

export default PublishersPage;
