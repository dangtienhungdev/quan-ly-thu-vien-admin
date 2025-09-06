import type { Publisher } from '@/types/publishers';
import { useState } from 'react';

export const usePublishersPageState = () => {
	// State cho Sheet tạo publisher
	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	// State cho dialog xóa publisher
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [publisherToDelete, setPublisherToDelete] = useState<{
		id: string;
		publisherName: string;
		description?: string;
	} | null>(null);

	// State cho Sheet edit publisher
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [publisherToEdit, setPublisherToEdit] = useState<Publisher | null>(
		null
	);

	// Handlers cho create sheet
	const openCreateSheet = () => setIsCreateSheetOpen(true);
	const closeCreateSheet = () => setIsCreateSheetOpen(false);

	// Handlers cho delete dialog
	const openDeleteDialog = (publisher: {
		id: string;
		publisherName: string;
		description?: string;
	}) => {
		setPublisherToDelete(publisher);
		setIsDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setIsDeleteDialogOpen(false);
		setPublisherToDelete(null);
	};

	// Handlers cho edit sheet
	const openEditSheet = (publisher: Publisher) => {
		setPublisherToEdit(publisher);
		setIsEditSheetOpen(true);
	};

	const closeEditSheet = () => {
		setIsEditSheetOpen(false);
		setPublisherToEdit(null);
	};

	// Handlers cho loading states
	const setCreating = (loading: boolean) => setIsCreating(loading);
	const setDeleting = (loading: boolean) => setIsDeleting(loading);

	return {
		// Create sheet state
		isCreateSheetOpen,
		openCreateSheet,
		closeCreateSheet,
		isCreating,
		setCreating,

		// Delete dialog state
		isDeleteDialogOpen,
		openDeleteDialog,
		closeDeleteDialog,
		isDeleting,
		setDeleting,
		publisherToDelete,

		// Edit sheet state
		isEditSheetOpen,
		openEditSheet,
		closeEditSheet,
		publisherToEdit,
	};
};
