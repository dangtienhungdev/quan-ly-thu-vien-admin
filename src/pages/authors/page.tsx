import {
	useAuthors,
	useAuthorsPageState,
	useCreateAuthor,
	useDeleteAuthor,
	useUpdateAuthor,
} from '@/hooks/authors';
import type { CreateAuthorRequest, UpdateAuthorRequest } from '@/types/authors';
import { createSearchParams, useNavigate } from 'react-router-dom';

import AuthorsErrorState from './components/authors-error-state';
import AuthorsLoadingSkeleton from './components/authors-loading-skeleton';
import AuthorsPageHeader from './components/authors-page-header';
import AuthorsSearch from './components/authors-search';
import AuthorsTable from './components/authors-table';
import DeleteAuthorDialog from './components/delete-author-dialog';
import EditAuthorSheet from './components/edit-author-sheet';
// Components
import PaginationWrapper from '@/components/pagination-wrapper';
import { useQueryParams } from '@/hooks/useQueryParam';
import { useCallback } from 'react';
import SearchStats from './components/search-stats';

const AuthorsPage = () => {
	const navigate = useNavigate();
	const queryParams = useQueryParams();
	const { page, limit, q } = queryParams;

	// Custom hooks for state management
	const {
		isCreateSheetOpen,
		openCreateSheet,
		closeCreateSheet,
		isDeleteDialogOpen,
		authorToDelete,
		openDeleteDialog,
		closeDeleteDialog,
		isEditSheetOpen,
		authorToEdit,
		openEditSheet,
		closeEditSheet,
	} = useAuthorsPageState();

	// Data fetching
	const { authors, meta, isLoading, isError, error, refetch } = useAuthors({
		params: {
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 10,
			q: q || undefined,
		},
	});

	// Mutations
	const { createAuthor, isCreating } = useCreateAuthor({
		onSuccess: () => {
			closeCreateSheet();
		},
	});

	const { updateAuthor, isUpdating } = useUpdateAuthor({
		onSuccess: () => {
			closeEditSheet();
		},
	});

	const { deleteAuthor, isDeleting } = useDeleteAuthor({
		onSuccess: () => {
			closeDeleteDialog();
		},
	});

	// Event handlers with useCallback for performance optimization
	const handleCreateAuthor = useCallback(
		(data: CreateAuthorRequest) => {
			createAuthor(data);
		},
		[createAuthor]
	);

	const handleUpdateAuthor = useCallback(
		(data: UpdateAuthorRequest) => {
			if (!authorToEdit) return;
			updateAuthor({ id: authorToEdit.id, data });
		},
		[authorToEdit, updateAuthor]
	);

	const handleDeleteAuthor = useCallback(() => {
		if (!authorToDelete) return;
		deleteAuthor(authorToDelete.id);
	}, [authorToDelete, deleteAuthor]);

	const handlePageChange = useCallback(
		(newPage: number) => {
			navigate({
				pathname: '/authors',
				search: createSearchParams({
					...queryParams,
					page: newPage.toString(),
				}).toString(),
			});
		},
		[navigate, queryParams]
	);

	const handleSearchChange = useCallback(
		(searchQuery: string) => {
			const newParams = { ...queryParams };
			if (searchQuery) {
				newParams.q = searchQuery;
			} else {
				delete newParams.q;
			}
			newParams.page = '1'; // Reset to first page when searching

			navigate({
				pathname: '/authors',
				search: createSearchParams(newParams).toString(),
			});
		},
		[navigate, queryParams]
	);

	const handleClearSearch = useCallback(() => {
		const newParams = { ...queryParams };
		delete newParams.q;
		newParams.page = '1'; // Reset to first page when clearing search

		navigate({
			pathname: '/authors',
			search: createSearchParams(newParams).toString(),
		});
	}, [navigate, queryParams]);

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

	// Loading state
	if (isLoading) {
		return <AuthorsLoadingSkeleton />;
	}

	// Error state
	if (isError) {
		return <AuthorsErrorState error={error} onRetry={refetch} />;
	}

	return (
		<>
			<AuthorsPageHeader
				isCreateSheetOpen={isCreateSheetOpen}
				onCreateSheetOpenChange={handleCreateSheetOpenChange}
				onCreateAuthor={handleCreateAuthor}
				onCloseCreateSheet={closeCreateSheet}
				isCreating={isCreating}
			/>

			<AuthorsSearch
				searchQuery={q || ''}
				onSearchChange={handleSearchChange}
				onClearSearch={handleClearSearch}
			/>

			{meta && q && (
				<SearchStats
					searchQuery={q}
					totalResults={meta.totalItems}
					currentPage={meta.page}
					totalPages={meta.totalPages}
					itemsPerPage={meta.limit}
				/>
			)}

			<div>
				<AuthorsTable
					authors={authors}
					onEdit={openEditSheet}
					onDelete={openDeleteDialog}
					searchQuery={q}
				/>

				{meta && (
					<div className="mt-4 space-y-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground text-center">
							{q ? (
								<>
									Tìm thấy {authors.length} tác giả cho "{q}"
									{meta.totalItems > 0 && (
										<span> (tổng {meta.totalItems} kết quả)</span>
									)}
								</>
							) : (
								<>
									HIển thị {authors.length} trên {meta.totalItems} tác giả
								</>
							)}
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

			<DeleteAuthorDialog
				isOpen={isDeleteDialogOpen}
				authorToDelete={authorToDelete}
				isDeleting={isDeleting}
				onClose={closeDeleteDialog}
				onConfirm={handleDeleteAuthor}
			/>

			<EditAuthorSheet
				isOpen={isEditSheetOpen}
				authorToEdit={authorToEdit}
				onOpenChange={closeEditSheet}
				onUpdateAuthor={handleUpdateAuthor}
				onClose={closeEditSheet}
				isUpdating={isUpdating}
			/>
		</>
	);
};

export default AuthorsPage;
