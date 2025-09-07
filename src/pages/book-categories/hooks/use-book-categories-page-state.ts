import { useCallback, useState } from 'react';

import type { BookCategory } from '@/types/book-categories';

export const useBookCategoriesPageState = () => {
	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [categoryToEdit, setCategoryToEdit] = useState<BookCategory | null>(
		null
	);
	const [categoryToDelete, setCategoryToDelete] = useState<BookCategory | null>(
		null
	);

	const openCreateSheet = useCallback(() => {
		setIsCreateSheetOpen(true);
	}, []);

	const closeCreateSheet = useCallback(() => {
		setIsCreateSheetOpen(false);
	}, []);

	const openEditSheet = useCallback((category: BookCategory) => {
		setCategoryToEdit(category);
		setIsEditSheetOpen(true);
	}, []);

	const closeEditSheet = useCallback(() => {
		setIsEditSheetOpen(false);
		setCategoryToEdit(null);
	}, []);

	const openDeleteDialog = useCallback((category: BookCategory) => {
		setCategoryToDelete(category);
		setIsDeleteDialogOpen(true);
	}, []);

	const closeDeleteDialog = useCallback(() => {
		setIsDeleteDialogOpen(false);
		setCategoryToDelete(null);
	}, []);

	return {
		// State
		isCreateSheetOpen,
		isEditSheetOpen,
		isDeleteDialogOpen,
		categoryToEdit,
		categoryToDelete,

		// Actions
		openCreateSheet,
		closeCreateSheet,
		openEditSheet,
		closeEditSheet,
		openDeleteDialog,
		closeDeleteDialog,
	};
};
