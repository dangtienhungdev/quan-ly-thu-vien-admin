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
import {
	CreatePhysicalCopyForm,
	EditPhysicalCopyForm,
	PhysicalCopiesFilters,
	PhysicalCopiesHeader,
	PhysicalCopiesList,
	PhysicalCopiesStats,
	UpdateStatusDialog,
} from './components';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { IconLoader2 } from '@tabler/icons-react';
import { memo } from 'react';
import { usePhysicalCopiesPage } from './hooks/use-physical-copies-page';

const PhysicalCopiesPage = memo(() => {
	const {
		// State
		searchQuery,
		selectedStatus,
		selectedCondition,
		selectedLocation,
		activeTab,
		openCreateSheet,
		openEditSheet,
		openDeleteDialog,
		openUpdateStatusDialog,
		selectedCopy,

		// Data
		locationsData,
		copiesData,
		isLoadingCopies,
		availableCopies,
		maintenanceCopies,
		stats,

		// Mutations
		createCopyMutation,
		updateCopyMutation,
		deleteCopyMutation,
		updateStatusMutation,

		// Setters
		setSearchQuery,
		setSelectedStatus,
		setSelectedCondition,
		setSelectedLocation,
		setActiveTab,
		setOpenCreateSheet,
		setOpenEditSheet,
		setOpenDeleteDialog,
		setOpenUpdateStatusDialog,

		// Handlers
		handleCreateCopy,
		handleUpdateCopy,
		handleDeleteCopy,
		handleEditCopy,
		handleDeleteClick,
		handleUpdateStatusClick,
		handleUpdateStatus,

		// Utilities
		getStatusColor,
		getConditionColor,
		getStatusIcon,
		formatCurrency,
	} = usePhysicalCopiesPage();

	return (
		<div className="space-y-6">
			{/* Header */}
			<PhysicalCopiesHeader onCreateClick={() => setOpenCreateSheet(true)} />

			{/* Statistics Cards */}
			<PhysicalCopiesStats stats={stats} />

			{/* Main Content */}
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4"
			>
				<TabsList>
					<TabsTrigger value="all">Tất cả Bản sao</TabsTrigger>
					<TabsTrigger value="available">Sẵn sàng</TabsTrigger>
					<TabsTrigger value="maintenance">Bảo trì</TabsTrigger>
				</TabsList>

				{/* Search and Filter */}
				<PhysicalCopiesFilters
					searchQuery={searchQuery}
					selectedStatus={selectedStatus}
					selectedCondition={selectedCondition}
					selectedLocation={selectedLocation}
					locationsData={locationsData}
					onSearchChange={setSearchQuery}
					onStatusChange={setSelectedStatus}
					onConditionChange={setSelectedCondition}
					onLocationChange={setSelectedLocation}
				/>

				{/* Physical Copies List */}
				<TabsContent value="all" className="space-y-4">
					<PhysicalCopiesList
						copies={copiesData?.data || []}
						isLoading={isLoadingCopies}
						onEdit={handleEditCopy}
						onDelete={handleDeleteClick}
						onUpdateStatus={handleUpdateStatusClick}
						getStatusColor={getStatusColor}
						getConditionColor={getConditionColor}
						getStatusIcon={getStatusIcon}
						formatCurrency={formatCurrency}
					/>
				</TabsContent>

				<TabsContent value="available" className="space-y-4">
					<PhysicalCopiesList
						copies={availableCopies?.data || []}
						isLoading={false}
						onEdit={handleEditCopy}
						onDelete={handleDeleteClick}
						onUpdateStatus={handleUpdateStatusClick}
						getStatusColor={getStatusColor}
						getConditionColor={getConditionColor}
						getStatusIcon={getStatusIcon}
						formatCurrency={formatCurrency}
					/>
				</TabsContent>

				<TabsContent value="maintenance" className="space-y-4">
					<PhysicalCopiesList
						copies={maintenanceCopies?.data || []}
						isLoading={false}
						onEdit={handleEditCopy}
						onDelete={handleDeleteClick}
						onUpdateStatus={handleUpdateStatusClick}
						getStatusColor={getStatusColor}
						getConditionColor={getConditionColor}
						getStatusIcon={getStatusIcon}
						formatCurrency={formatCurrency}
					/>
				</TabsContent>
			</Tabs>

			{/* Create Physical Copy Sheet */}
			<Sheet open={openCreateSheet} onOpenChange={setOpenCreateSheet}>
				<SheetContent side="right" className="w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>Thêm bản sao mới</SheetTitle>
					</SheetHeader>
					<div className="px-4">
						<CreatePhysicalCopyForm
							onSubmit={handleCreateCopy}
							isLoading={createCopyMutation.isPending}
						/>
					</div>
				</SheetContent>
			</Sheet>

			{/* Edit Physical Copy Sheet */}
			<Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
				<SheetContent side="right" className="w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>Chỉnh sửa bản sao</SheetTitle>
					</SheetHeader>
					<div className="px-4">
						{selectedCopy && (
							<EditPhysicalCopyForm
								physicalCopy={selectedCopy}
								onSubmit={handleUpdateCopy}
								isLoading={updateCopyMutation.isPending}
							/>
						)}
					</div>
				</SheetContent>
			</Sheet>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa bản sao</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa bản sao "{selectedCopy?.barcode}"? Hành
							động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteCopy}
							disabled={deleteCopyMutation.isPending}
						>
							{deleteCopyMutation.isPending && (
								<IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Xóa
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Update Status Dialog */}
			<UpdateStatusDialog
				open={openUpdateStatusDialog}
				onOpenChange={setOpenUpdateStatusDialog}
				physicalCopy={selectedCopy}
				onUpdateStatus={handleUpdateStatus}
				isLoading={updateStatusMutation.isPending}
			/>
		</div>
	);
});

PhysicalCopiesPage.displayName = 'PhysicalCopiesPage';

export default PhysicalCopiesPage;
