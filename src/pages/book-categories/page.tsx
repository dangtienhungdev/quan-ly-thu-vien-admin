import type {
	CreateBookCategoryRequest,
	UpdateBookCategoryRequest,
} from '@/types/book-categories';
import { createSearchParams, useNavigate } from 'react-router-dom';
import {
	useBookCategories,
	useCreateBookCategory,
	useDeleteBookCategory,
	useUpdateBookCategory,
} from '@/hooks/book-categories';

import BookCategoriesErrorState from './components/book-categories-error-state';
import BookCategoriesLoadingSkeleton from './components/book-categories-loading-skeleton';
import BookCategoriesPageHeader from './components/book-categories-page-header';
import BookCategoriesSearch from './components/book-categories-search';
import BookCategoriesTable from './components/book-categories-table';
import DeleteBookCategoryDialog from './components/delete-book-category-dialog';
import EditBookCategorySheet from './components/edit-book-category-sheet';
// Components
import PaginationWrapper from '@/components/pagination-wrapper';
import SearchStats from './components/search-stats';
import { useBookCategoriesPageState } from './hooks/use-book-categories-page-state';
import { useCallback } from 'react';
import { useQueryParams } from '@/hooks/useQueryParam';

const BookCategoriesPage = () => {
	const navigate = useNavigate();
	const queryParams = useQueryParams();
	const { page, limit, q } = queryParams;

	// Custom hooks for state management
	const {
		isCreateSheetOpen,
		openCreateSheet,
		closeCreateSheet,
		isDeleteDialogOpen,
		categoryToDelete,
		openDeleteDialog,
		closeDeleteDialog,
		isEditSheetOpen,
		categoryToEdit,
		openEditSheet,
		closeEditSheet,
	} = useBookCategoriesPageState();

	// Data fetching
	const { bookCategories, meta, isLoading, isError, error, refetch } =
		useBookCategories({
			params: {
				page: page ? Number(page) : 1,
				limit: limit ? Number(limit) : 10,
				q: q || undefined,
			},
		});

	// Mutations
	const { createBookCategory, isCreating } = useCreateBookCategory({
		onSuccess: () => {
			closeCreateSheet();
		},
	});

	const { updateBookCategory, isUpdating } = useUpdateBookCategory({
		onSuccess: () => {
			closeEditSheet();
		},
	});

	const { deleteBookCategory, isDeleting } = useDeleteBookCategory({
		onSuccess: () => {
			closeDeleteDialog();
		},
	});

	// Event handlers with useCallback for performance optimization
	const handleCreateCategory = useCallback(
		(data: CreateBookCategoryRequest) => {
			createBookCategory(data);
		},
		[createBookCategory]
	);

	const handleUpdateCategory = useCallback(
		(data: UpdateBookCategoryRequest) => {
			if (!categoryToEdit) return;
			updateBookCategory({ id: categoryToEdit.id, data });
		},
		[categoryToEdit, updateBookCategory]
	);

	const handleDeleteCategory = useCallback(() => {
		if (!categoryToDelete) return;
		deleteBookCategory(categoryToDelete.id);
	}, [categoryToDelete, deleteBookCategory]);

	const handlePageChange = useCallback(
		(newPage: number) => {
			navigate({
				pathname: '/book-categories',
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
				pathname: '/book-categories',
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
			pathname: '/book-categories',
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
		return <BookCategoriesLoadingSkeleton />;
	}

	// Error state
	if (isError) {
		return <BookCategoriesErrorState error={error} onRetry={refetch} />;
	}

	return (
		<>
			<BookCategoriesPageHeader
				isCreateSheetOpen={isCreateSheetOpen}
				onCreateSheetOpenChange={handleCreateSheetOpenChange}
				onCreateCategory={handleCreateCategory}
				onCloseCreateSheet={closeCreateSheet}
				isCreating={isCreating}
				categories={(bookCategories || []).filter((c) => !c.parent_id)}
			/>

			<BookCategoriesSearch
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
				<BookCategoriesTable
					categories={bookCategories}
					onEdit={openEditSheet}
					onDelete={openDeleteDialog}
					searchQuery={q}
				/>

				{meta && (
					<div className="mt-4 space-y-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground text-center">
							{q ? (
								<>
									Tìm thấy {bookCategories.length} thể loại cho "{q}"
									{meta.totalItems > 0 && (
										<span> (tổng {meta.totalItems} kết quả)</span>
									)}
								</>
							) : (
								<>
									Hiển thị {bookCategories.length} trên {meta.totalItems} thể
									loại
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

			<DeleteBookCategoryDialog
				isOpen={isDeleteDialogOpen}
				categoryToDelete={categoryToDelete}
				isDeleting={isDeleting}
				onClose={closeDeleteDialog}
				onConfirm={handleDeleteCategory}
			/>

			<EditBookCategorySheet
				isOpen={isEditSheetOpen}
				categoryToEdit={categoryToEdit}
				onOpenChange={closeEditSheet}
				onUpdateCategory={handleUpdateCategory}
				onClose={closeEditSheet}
				isUpdating={isUpdating}
				categories={bookCategories}
			/>
		</>
	);
};

export default BookCategoriesPage;
