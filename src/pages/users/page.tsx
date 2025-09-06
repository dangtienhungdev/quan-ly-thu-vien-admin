import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PaginationWrapper from '@/components/pagination-wrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUsers } from '@/hooks';
import { useReaders } from '@/hooks/readers/use-readers';
import { useUserOperations } from '@/hooks/users/use-user-operations';
import { useUserSearch } from '@/hooks/users/use-user-search';
import type { Reader } from '@/types/readers';
import type { UserRole } from '@/types/user.type';
import { IconRefresh } from '@tabler/icons-react';
import { omit } from 'lodash';
import { ActionButtons } from './components/action-buttons';
import { DeleteConfirmDialog } from './components/delete-confirm-dialog';
import { EditUserSheet } from './components/edit-user-sheet';
import { SearchBar } from './components/search-bar';
import { UserTable } from './components/user-table';

const UserPage = () => {
	// Custom hooks
	const searchHook = useUserSearch();
	const operationsHook = useUserOperations();

	// Destructure search hook
	const {
		searchValue,
		currentSearch,
		searchInputRef,
		type,
		handleSearchChange,
		handleSearch,
		handleKeyPress,
		handleTabChange,
		handlePageChange,
		buildApiParams,
	} = searchHook;

	// Destructure operations hook
	const {
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
		isCreating,
		isImporting,
		isUpdating,
		isDeleting,
		handleCreateUser,
		handleImportUsers,
		handleUpdateUser,
		handleDeleteUser,
		openDeleteDialog,
		openEditSheet,
		closeDeleteDialog,
		closeEditSheet,
	} = operationsHook;

	// API calls - use readers when type is 'reader', users otherwise
	const isReaderView = type === 'reader';

	const { users, meta, isLoading, isError, error, refetch } = useUsers({
		params: buildApiParams(),
		enabled: !isReaderView,
	});

	const {
		readers,
		meta: readersMeta,
		isLoading: isReadersLoading,
		isError: isReadersError,
		error: readersError,
		refetch: refetchReaders,
	} = useReaders({
		params: omit(buildApiParams(), 'type'),
		enabled: isReaderView,
	});

	// Use appropriate data based on view type
	const currentData = isReaderView ? readers : users;
	const currentMeta = isReaderView ? readersMeta : meta;
	const currentIsLoading = isReaderView ? isReadersLoading : isLoading;
	const currentIsError = isReaderView ? isReadersError : isError;
	const currentError = isReaderView ? readersError : error;
	const currentRefetch = isReaderView ? refetchReaders : refetch;

	// Handler functions
	const handleCloseCreateSheet = () => {
		setIsCreateSheetOpen(false);
	};

	if (currentIsLoading) {
		return (
			<div className="container mx-auto py-6">
				<Card>
					<CardHeader>
						<Skeleton className="h-8 w-48" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (currentIsError) {
		return (
			<div className="container mx-auto py-6">
				<Alert variant="destructive">
					<AlertDescription>
						Failed to load {isReaderView ? 'readers' : 'users'}:{' '}
						{currentError?.message || 'Unknown error'}
					</AlertDescription>
				</Alert>
				<Button onClick={() => currentRefetch()} className="mt-4">
					<IconRefresh className="mr-2 h-4 w-4" />
					Retry
				</Button>
			</div>
		);
	}

	return (
		<>
			<div className="mb-2 flex items-center justify-between space-y-2">
				<h1 className="text-2xl font-bold tracking-tight">
					Quản lý người dùng
				</h1>
				<ActionButtons
					type={type}
					isCreateSheetOpen={isCreateSheetOpen}
					setIsCreateSheetOpen={setIsCreateSheetOpen}
					isImportSheetOpen={isImportSheetOpen}
					setIsImportSheetOpen={setIsImportSheetOpen}
					onCreateUser={handleCreateUser}
					onImportUsers={handleImportUsers}
					onCloseCreateSheet={handleCloseCreateSheet}
					isCreating={isCreating}
					isImporting={isImporting}
				/>
			</div>

			<SearchBar
				searchValue={searchValue}
				onSearchChange={handleSearchChange}
				onSearch={handleSearch}
				onKeyPress={handleKeyPress}
				searchInputRef={searchInputRef as React.RefObject<HTMLInputElement>}
				currentSearch={currentSearch}
			/>

			<Tabs
				orientation="vertical"
				value={type || 'reader'}
				onValueChange={handleTabChange}
				className="space-y-4"
			>
				<div className="w-full overflow-x-auto pb-2">
					<TabsList>
						<TabsTrigger value="reader">Độc giả</TabsTrigger>
						<TabsTrigger value="admin">Quản trị viên</TabsTrigger>
					</TabsList>
				</div>
			</Tabs>

			<div>
				<UserTable
					users={currentData}
					searchValue={searchValue}
					onEditUser={(user) => {
						// Convert Reader to UserToEdit format for editing
						if (isReaderView && 'readerType' in user) {
							const reader = user as Reader;
							openEditSheet({
								id: reader.id,
								userCode: reader.user?.userCode || '',
								username: reader.fullName,
								email: reader.user?.email || '',
								role: 'reader' as UserRole,
								accountStatus: reader.isActive ? 'active' : 'inactive',
							});
						} else {
							openEditSheet(user as Parameters<typeof openEditSheet>[0]);
						}
					}}
					onDeleteUser={openDeleteDialog}
					isReaderView={isReaderView}
				/>

				{currentMeta && (
					<div className="mt-4 space-y-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground text-center">
							Hiển thị {currentData.length} of {currentMeta.totalItems}{' '}
							{isReaderView ? 'readers' : 'users'}
							{currentMeta.totalPages > 1 && (
								<span>
									{' '}
									(Trang {currentMeta.page} trên {currentMeta.totalPages})
								</span>
							)}
						</div>

						{currentMeta.totalPages > 1 && (
							<div className="w-fit">
								<PaginationWrapper
									currentPage={currentMeta.page}
									totalPages={currentMeta.totalPages}
									onPageChange={handlePageChange}
								/>
							</div>
						)}
					</div>
				)}
			</div>

			<DeleteConfirmDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				userToDelete={userToDelete}
				onConfirm={handleDeleteUser}
				onClose={closeDeleteDialog}
				isDeleting={isDeleting}
			/>

			<EditUserSheet
				open={isEditSheetOpen}
				onOpenChange={setIsEditSheetOpen}
				userToEdit={userToEdit}
				onSubmit={handleUpdateUser}
				onCancel={closeEditSheet}
				isLoading={isUpdating}
			/>
		</>
	);
};

export default UserPage;
