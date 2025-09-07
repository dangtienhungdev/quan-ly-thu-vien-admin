import type {
	CreateUserRequest,
	UpdateUserRequest,
	UserRole,
} from '@/types/user.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReadersAPI } from '@/apis';
import { UsersAPI } from '@/apis/users';
import { toast } from 'sonner';
import { useState } from 'react';

interface UserToDelete {
	id: string;
	readerId: string;
	userCode: string;
	username: string;
}

interface UserToEdit {
	id: string;
	userCode: string;
	username: string;
	email: string;
	role: UserRole;
	accountStatus: 'active' | 'inactive' | 'banned';
}

export const useUserOperations = () => {
	const queryClient = useQueryClient();

	// State cho các operations
	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
	const [isImportSheetOpen, setIsImportSheetOpen] = useState(false);
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [userToDelete, setUserToDelete] = useState<UserToDelete | null>(null);
	const [userToEdit, setUserToEdit] = useState<UserToEdit | null>(null);

	// Create user mutation
	const createUserMutation = useMutation({
		mutationFn: (data: CreateUserRequest) => UsersAPI.create(data),
		onSuccess: (newUser) => {
			toast.success(
				`Tạo ${
					newUser.role === 'admin' ? 'nhân viên' : 'người dùng'
				} thành công! Mã: ${newUser.userCode}`
			);
			setIsCreateSheetOpen(false);
			// Invalidate both users and readers queries to refetch data
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.invalidateQueries({ queryKey: ['readers'] });
			// Also invalidate any queries that might be using these keys
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0] === 'users' || query.queryKey[0] === 'readers',
			});
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi tạo người dùng');
		},
	});

	// Import users mutation
	const importUsersMutation = useMutation({
		mutationFn: (transformedData: CreateUserRequest[]) =>
			UsersAPI.createMultiple({ users: transformedData }),
		onSuccess: (result) => {
			toast.success(
				`Import thành công ${result.successCount}/${result.totalUsers} người dùng!`
			);
			setIsImportSheetOpen(false);
			// Invalidate both users and readers queries to refetch data
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.invalidateQueries({ queryKey: ['readers'] });
			// Also invalidate any queries that might be using these keys
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0] === 'users' || query.queryKey[0] === 'readers',
			});
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi import người dùng');
		},
	});

	// Update user mutation
	const updateUserMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
			UsersAPI.update(id, data),
		onSuccess: (data) => {
			toast.success(`Cập nhật người dùng ${data.userCode} thành công!`);
			setIsEditSheetOpen(false);
			setUserToEdit(null);
			// Invalidate both users and readers queries to refetch data
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.invalidateQueries({ queryKey: ['readers'] });
			// Also invalidate any queries that might be using these keys
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0] === 'users' || query.queryKey[0] === 'readers',
			});
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi cập nhật người dùng');
		},
	});

	// Delete user mutation
	const deleteUserMutation = useMutation({
		mutationFn: (id: string) => UsersAPI.delete(id),
		onSuccess: (response) => {
			console.log('🚀 ~ useUserOperations ~ response:', response);
			toast.success(`Xóa người dùng ${userToDelete?.userCode} thành công!`);
			setIsDeleteDialogOpen(false);
			setUserToDelete(null);
			// Invalidate both users and readers queries to refetch data
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.invalidateQueries({ queryKey: ['readers'] });
			// Also invalidate any queries that might be using these keys
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0] === 'users' || query.queryKey[0] === 'readers',
			});
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi xóa người dùng');
		},
	});

	// Handler functions
	const handleCreateUser = (data: CreateUserRequest) => {
		createUserMutation.mutate(data);
	};

	const handleImportUsers = (transformedData: CreateUserRequest[]) => {
		importUsersMutation.mutate(transformedData);
	};

	const handleUpdateUser = (data: UpdateUserRequest) => {
		if (!userToEdit) return;
		updateUserMutation.mutate({ id: userToEdit.id, data });
	};

	const handleDeleteUser = async () => {
		if (!userToDelete) return;
		try {
			// get reader by user id
			const reader = await ReadersAPI.getByUserId(userToDelete.id);
			console.log('🚀 ~ handleDeleteUser ~ reader:', reader);

			await Promise.all([
				ReadersAPI.delete(reader.id),
				UsersAPI.delete(userToDelete.id),
			]);

			toast.success(`Xóa người dùng ${userToDelete.userCode} thành công!`);
			setIsDeleteDialogOpen(false);
			setUserToDelete(null);
			// Invalidate both users and readers queries to refetch data
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.invalidateQueries({ queryKey: ['readers'] });
			// Also invalidate any queries that might be using these keys
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0] === 'users' || query.queryKey[0] === 'readers',
			});
		} catch {
			// delete user if reader not found
			deleteUserMutation.mutate(userToDelete.id);
		}
	};

	const openDeleteDialog = (user: UserToDelete) => {
		setUserToDelete(user);
		setIsDeleteDialogOpen(true);
	};

	const openEditSheet = (user: UserToEdit) => {
		setUserToEdit(user);
		setIsEditSheetOpen(true);
	};

	const closeDeleteDialog = () => {
		setIsDeleteDialogOpen(false);
		setUserToDelete(null);
	};

	const closeEditSheet = () => {
		setIsEditSheetOpen(false);
		setUserToEdit(null);
	};

	return {
		// State
		isCreateSheetOpen,
		setIsCreateSheetOpen,
		isImportSheetOpen,
		setIsImportSheetOpen,
		isEditSheetOpen,
		setIsEditSheetOpen,
		isDeleteDialogOpen,
		setIsDeleteDialogOpen,
		userToDelete,
		userToEdit,

		// Loading states
		isCreating: createUserMutation.isPending,
		isImporting: importUsersMutation.isPending,
		isUpdating: updateUserMutation.isPending,
		isDeleting: deleteUserMutation.isPending,

		// Handlers
		handleCreateUser,
		handleImportUsers,
		handleUpdateUser,
		handleDeleteUser,
		openDeleteDialog,
		openEditSheet,
		closeDeleteDialog,
		closeEditSheet,
	};
};
