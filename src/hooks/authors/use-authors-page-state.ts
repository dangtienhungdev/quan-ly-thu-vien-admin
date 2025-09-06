import { useCallback, useState } from 'react';

import type { Author } from '@/types/authors';

export const useAuthorsPageState = () => {
	// State cho Sheet tạo author
	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

	// State cho dialog xóa author
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [authorToDelete, setAuthorToDelete] = useState<{
		id: string;
		author_name: string;
		bio?: string;
	} | null>(null);

	// State cho Sheet edit author
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [authorToEdit, setAuthorToEdit] = useState<Author | null>(null);

	// Handlers cho create sheet
	const openCreateSheet = useCallback(() => {
		setIsCreateSheetOpen(true);
	}, []);

	const closeCreateSheet = useCallback(() => {
		setIsCreateSheetOpen(false);
	}, []);

	// Handlers cho delete dialog
	const openDeleteDialog = useCallback(
		(author: { id: string; author_name: string; bio?: string }) => {
			setAuthorToDelete(author);
			setIsDeleteDialogOpen(true);
		},
		[]
	);

	const closeDeleteDialog = useCallback(() => {
		setIsDeleteDialogOpen(false);
		setAuthorToDelete(null);
	}, []);

	// Handlers cho edit sheet
	const openEditSheet = useCallback((author: Author) => {
		setAuthorToEdit(author);
		setIsEditSheetOpen(true);
	}, []);

	const closeEditSheet = useCallback(() => {
		setIsEditSheetOpen(false);
		setAuthorToEdit(null);
	}, []);

	return {
		// Create sheet state
		isCreateSheetOpen,
		openCreateSheet,
		closeCreateSheet,

		// Delete dialog state
		isDeleteDialogOpen,
		authorToDelete,
		openDeleteDialog,
		closeDeleteDialog,

		// Edit sheet state
		isEditSheetOpen,
		authorToEdit,
		openEditSheet,
		closeEditSheet,
	};
};
