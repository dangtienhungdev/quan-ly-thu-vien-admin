import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { CreateLocationData, UpdateLocationData } from '@/types';
import {
	CreateLocationForm,
	EditLocationForm,
	LocationsEmpty,
	LocationsError,
	LocationsLoading,
	LocationsTable,
} from './components';
import { IconLoader2, IconPlus, IconSearch, IconX } from '@tabler/icons-react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { memo, useCallback, useState } from 'react';
import {
	useCreateLocation,
	useDeleteLocation,
	useLocations,
	useLocationsPageState,
	useUpdateLocation,
} from '@/hooks/locations';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PaginationWrapper from '@/components/pagination-wrapper';

const LocationsPage = memo(() => {
	const {
		search,
		page,
		limit,
		setSearch,
		setPage,
		openCreateSheet,
		openEditSheet,
		openDeleteDialog,
		selectedLocation,
		openCreateSheetHandler,
		closeCreateSheet,
		openEditSheetHandler,
		closeEditSheet,
		openDeleteDialogHandler,
		closeDeleteDialog,
	} = useLocationsPageState();

	const [localSearchQuery, setLocalSearchQuery] = useState(search);

	const {
		data: locationsData,
		isLoading,
		error,
	} = useLocations({
		page,
		limit,
		q: search,
	});

	const createLocationMutation = useCreateLocation();
	const updateLocationMutation = useUpdateLocation();
	const deleteLocationMutation = useDeleteLocation();

	const handleCreateLocation = useCallback(
		(data: CreateLocationData) => {
			createLocationMutation.mutate(data, {
				onSuccess: () => {
					closeCreateSheet();
				},
			});
		},
		[createLocationMutation, closeCreateSheet]
	);

	const handleUpdateLocation = useCallback(
		(data: UpdateLocationData) => {
			if (selectedLocation) {
				updateLocationMutation.mutate(
					{ id: selectedLocation.id, data },
					{
						onSuccess: () => {
							closeEditSheet();
						},
					}
				);
			}
		},
		[updateLocationMutation, selectedLocation, closeEditSheet]
	);

	const handleDeleteLocation = useCallback(() => {
		if (selectedLocation) {
			deleteLocationMutation.mutate(selectedLocation.id, {
				onSuccess: () => {
					closeDeleteDialog();
				},
			});
		}
	}, [deleteLocationMutation, selectedLocation, closeDeleteDialog]);

	// Search handlers
	const handleSearch = useCallback(() => {
		setSearch(localSearchQuery);
	}, [localSearchQuery, setSearch]);

	const handleClearSearch = useCallback(() => {
		setLocalSearchQuery('');
		setSearch('');
	}, [setSearch]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				handleSearch();
			}
		},
		[handleSearch]
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			setPage(newPage);
		},
		[setPage]
	);

	const handleCreateSheetOpenChange = useCallback(
		(open: boolean) => {
			if (open) {
				openCreateSheetHandler();
			} else {
				closeCreateSheet();
			}
		},
		[openCreateSheetHandler, closeCreateSheet]
	);

	// Loading state
	if (isLoading) {
		return <LocationsLoading />;
	}

	// Error state
	if (error) {
		return <LocationsError error={error} />;
	}

	return (
		<>
			{/* Page Header */}
			<div className="mb-2 flex items-center justify-between space-y-2">
				<h1 className="text-2xl font-bold tracking-tight">
					Quản lý vị trí kệ sách
				</h1>
				<div className="flex items-center space-x-2">
					<Sheet
						open={openCreateSheet}
						onOpenChange={handleCreateSheetOpenChange}
					>
						<SheetTrigger asChild>
							<Button>
								<IconPlus className="mr-2 h-4 w-4" />
								Thêm vị trí
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[400px] sm:w-[540px]">
							<SheetHeader>
								<SheetTitle>Thêm vị trí mới</SheetTitle>
							</SheetHeader>
							<div className="px-4">
								<CreateLocationForm
									onSubmit={handleCreateLocation}
									isLoading={createLocationMutation.isPending}
								/>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>

			{/* Search */}
			<div className="flex items-center space-x-2 mb-4">
				<div className="relative flex-1">
					<IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm vị trí theo tên, khu vực, tầng..."
						value={localSearchQuery}
						onChange={(e) => setLocalSearchQuery(e.target.value)}
						onKeyPress={handleKeyPress}
						className="pl-10 pr-10"
					/>
					{localSearchQuery && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleClearSearch}
							className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
						>
							<IconX className="h-3 w-3" />
						</Button>
					)}
				</div>
				<Button
					onClick={handleSearch}
					variant={localSearchQuery ? 'default' : 'outline'}
				>
					<IconSearch className="mr-2 h-4 w-4" />
					Tìm kiếm
				</Button>
			</div>

			{/* Search Stats */}
			{locationsData?.meta && search && (
				<div className="mb-4 p-3 bg-muted/50 rounded-lg">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Badge variant="secondary">Kết quả tìm kiếm</Badge>
							<span className="text-sm text-muted-foreground">"{search}"</span>
						</div>
						<div className="text-sm text-muted-foreground">
							{locationsData.meta.totalItems > 0 ? (
								<>
									Hiển thị{' '}
									{Math.min(
										(page - 1) * limit + 1,
										locationsData.meta.totalItems
									)}
									-{Math.min(page * limit, locationsData.meta.totalItems)} trong
									tổng số {locationsData.meta.totalItems} kết quả
								</>
							) : (
								'Không có kết quả nào'
							)}
						</div>
					</div>
				</div>
			)}

			{/* Table */}
			<div>
				{!locationsData?.data.length ? (
					<LocationsEmpty hasSearch={!!search} />
				) : (
					<LocationsTable
						locations={locationsData.data}
						onEdit={openEditSheetHandler}
						onDelete={openDeleteDialogHandler}
					/>
				)}

				{/* Pagination */}
				{locationsData?.meta && (
					<div className="mt-4 space-y-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground text-center">
							{search ? (
								<>
									Tìm thấy {locationsData.data.length} vị trí cho "{search}"
									{locationsData.meta.totalItems > 0 && (
										<span> (tổng {locationsData.meta.totalItems} kết quả)</span>
									)}
								</>
							) : (
								<>
									Hiển thị {locationsData.data.length} trên{' '}
									{locationsData.meta.totalItems} vị trí
								</>
							)}
							{locationsData.meta.totalPages > 1 && (
								<span>
									{' '}
									(Trang {locationsData.meta.page} trên{' '}
									{locationsData.meta.totalPages})
								</span>
							)}
						</div>

						<div>
							{locationsData.meta.totalPages > 1 && (
								<PaginationWrapper
									currentPage={locationsData.meta.page}
									totalPages={locationsData.meta.totalPages}
									onPageChange={handlePageChange}
								/>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Edit Location Sheet */}
			<Sheet open={openEditSheet} onOpenChange={closeEditSheet}>
				<SheetContent side="right" className="w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>Chỉnh sửa vị trí</SheetTitle>
					</SheetHeader>
					<div className="px-4">
						{selectedLocation && (
							<EditLocationForm
								location={selectedLocation}
								onSubmit={handleUpdateLocation}
								isLoading={updateLocationMutation.isPending}
							/>
						)}
					</div>
				</SheetContent>
			</Sheet>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={openDeleteDialog} onOpenChange={closeDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa vị trí</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa vị trí "{selectedLocation?.name}"? Hành
							động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteLocation}
							disabled={deleteLocationMutation.isPending}
						>
							{deleteLocationMutation.isPending && (
								<IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Xóa
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
});

LocationsPage.displayName = 'LocationsPage';

export default LocationsPage;
