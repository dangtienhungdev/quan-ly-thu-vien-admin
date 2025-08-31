import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useReaderTypes, useUpdateReaderType } from '@/hooks';
import type {
	CreateReaderTypeRequest,
	ReaderTypeConfig,
	UpdateReaderTypeRequest,
} from '@/types/reader-types';
import { IconEdit, IconRefresh } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ReaderTypesAPI } from '@/apis/reader-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import _ from 'lodash';
import { useState } from 'react';
import { toast } from 'sonner';
import EditReaderTypeForm from './components/edit-reader-type-form';

const ReaderTypesPage = () => {
	const [queryParams] = useSearchParams();
	const navigate = useNavigate();
	const page = queryParams.get('page');
	const limit = queryParams.get('limit');

	// State cho Sheet tạo reader type
	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	// State cho dialog xóa reader type
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [readerTypeToDelete, setReaderTypeToDelete] = useState<{
		id: string;
		typeName: string;
		description: string;
	} | null>(null);

	// State cho Sheet edit reader type
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [readerTypeToEdit, setReaderTypeToEdit] =
		useState<ReaderTypeConfig | null>(null);

	// Hook để cập nhật reader type
	const { updateReaderType, isUpdating } = useUpdateReaderType({
		onSuccess: () => {
			setIsEditSheetOpen(false);
			setReaderTypeToEdit(null);
		},
	});

	const { readerTypes, meta, isLoading, isError, error, refetch } =
		useReaderTypes({
			params: {
				page: page ? Number(page) : 1,
				limit: limit ? Number(limit) : 10,
			},
		});

	// Hàm xử lý tạo reader type
	const handleCreateReaderType = async (data: CreateReaderTypeRequest) => {
		try {
			setIsCreating(true);
			const newReaderType = await ReaderTypesAPI.create(data);
			toast.success(`Tạo loại độc giả ${newReaderType.typeName} thành công!`);
			setIsCreateSheetOpen(false);
			refetch();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi tạo loại độc giả';
			toast.error(errorMessage);
		} finally {
			setIsCreating(false);
		}
	};

	// Hàm đóng Sheet
	const handleCloseSheet = () => {
		setIsCreateSheetOpen(false);
	};

	// Hàm mở dialog xóa reader type
	const handleOpenDeleteDialog = (readerType: {
		id: string;
		typeName: string;
		description: string;
	}) => {
		setReaderTypeToDelete(readerType);
		setIsDeleteDialogOpen(true);
	};

	// Hàm xử lý xóa reader type
	const handleDeleteReaderType = async () => {
		if (!readerTypeToDelete) return;

		try {
			setIsDeleting(true);
			await ReaderTypesAPI.delete(readerTypeToDelete.id);
			toast.success(
				`Xóa loại độc giả ${readerTypeToDelete.typeName} thành công!`
			);
			setIsDeleteDialogOpen(false);
			setReaderTypeToDelete(null);
			refetch();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi xóa loại độc giả';
			toast.error(errorMessage);
		} finally {
			setIsDeleting(false);
		}
	};

	// Hàm đóng dialog xóa
	const handleCloseDeleteDialog = () => {
		setIsDeleteDialogOpen(false);
		setReaderTypeToDelete(null);
	};

	// Hàm mở Sheet edit reader type
	const handleOpenEditSheet = (readerType: ReaderTypeConfig) => {
		setReaderTypeToEdit(readerType);
		setIsEditSheetOpen(true);
	};

	// Hàm xử lý cập nhật reader type
	const handleUpdateReaderType = (data: UpdateReaderTypeRequest) => {
		if (!readerTypeToEdit) return;
		updateReaderType({
			id: readerTypeToEdit.id,
			data: _.omit(data, ['lateReturnFinePerDay']),
		});
	};

	// Hàm đóng Sheet edit
	const handleCloseEditSheet = () => {
		setIsEditSheetOpen(false);
		setReaderTypeToEdit(null);
	};

	// Hàm xử lý thay đổi trang
	const handlePageChange = (newPage: number) => {
		const newParams = new URLSearchParams(queryParams);
		newParams.set('page', newPage.toString());
		navigate(`?${newParams.toString()}`);
	};

	const getTypeNameLabel = (typeName: string) => {
		switch (typeName) {
			case 'student':
				return 'Học sinh';
			case 'teacher':
				return 'Giáo viên';
			case 'staff':
				return 'Cán bộ';
			default:
				return typeName;
		}
	};

	const getTypeNameBadgeVariant = (typeName: string) => {
		switch (typeName) {
			case 'student':
				return 'default';
			case 'teacher':
				return 'secondary';
			case 'staff':
				return 'outline';
			default:
				return 'secondary';
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(amount);
	};

	if (isLoading) {
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

	if (isError) {
		return (
			<div className="container mx-auto py-6">
				<Alert variant="destructive">
					<AlertDescription>
						Failed to load reader types: {error?.message || 'Unknown error'}
					</AlertDescription>
				</Alert>
				<Button onClick={() => refetch()} className="mt-4">
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
					Cài đặt quyền mượn sách
				</h1>
				{/* <div className="flex items-center space-x-2">
					<Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
						<SheetTrigger asChild>
							<Button>
								<IconPlus className="mr-2 h-4 w-4" />
								Thêm loại độc giả
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[400px] sm:w-[540px]">
							<SheetHeader>
								<SheetTitle>Thêm loại độc giả mới</SheetTitle>
							</SheetHeader>
							<div className="px-4">
								<CreateReaderTypeForm
									onSubmit={handleCreateReaderType}
									onCancel={handleCloseSheet}
									isLoading={isCreating}
								/>
							</div>
						</SheetContent>
					</Sheet>
				</div> */}
			</div>

			<div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Loại độc giả</TableHead>
							<TableHead>Giới hạn mượn</TableHead>
							<TableHead>Thời gian mượn</TableHead>
							{/* <TableHead>Tiền phạt/ngày</TableHead> */}
							<TableHead>Mô tả</TableHead>
							<TableHead className="text-right">Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{readerTypes.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-8">
									Không tìm thấy loại độc giả nào
								</TableCell>
							</TableRow>
						) : (
							readerTypes.map((readerType) => (
								<TableRow key={readerType.id}>
									<TableCell className="font-medium">
										<Badge
											variant={getTypeNameBadgeVariant(readerType.typeName)}
										>
											{getTypeNameLabel(readerType.typeName)}
										</Badge>
									</TableCell>
									<TableCell>{readerType.maxBorrowLimit} cuốn</TableCell>
									<TableCell>{readerType.borrowDurationDays} ngày</TableCell>
									{/* <TableCell>
										{formatCurrency(readerType.lateReturnFinePerDay)}
									</TableCell> */}
									<TableCell className="truncate">
										{readerType.description}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end space-x-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleOpenEditSheet(readerType)}
												className="h-8 w-8 p-0 text-primary hover:text-primary"
											>
												<IconEdit className="h-4 w-4" />
												<span className="sr-only">Chỉnh sửa loại độc giả</span>
											</Button>
											{/* <Button
												variant="ghost"
												size="sm"
												onClick={() =>
													handleOpenDeleteDialog({
														id: readerType.id,
														typeName: readerType.typeName,
														description: readerType.description,
													})
												}
												className="h-8 w-8 p-0 text-destructive hover:text-destructive"
											>
												<IconTrash className="h-4 w-4" />
												<span className="sr-only">Xóa loại độc giả</span>
											</Button> */}
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>

				{/* {meta && (
					<div className="mt-4 space-y-4">
						<div className="text-sm text-muted-foreground text-center">
							Showing {readerTypes.length} of {meta.totalItems} reader types
							{meta.totalPages > 1 && (
								<span>
									{' '}
									(Page {meta.page} of {meta.totalPages})
								</span>
							)}
						</div>

						{meta.totalPages > 1 && (
							<PaginationWrapper
								currentPage={meta.page}
								totalPages={meta.totalPages}
								onPageChange={handlePageChange}
							/>
						)}
					</div>
				)} */}
			</div>

			{/* Dialog xác nhận xóa reader type */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa loại độc giả</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa loại độc giả{' '}
							<strong>
								{getTypeNameLabel(readerTypeToDelete?.typeName || '')}
							</strong>
							?
							<br />
							Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCloseDeleteDialog}>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteReaderType}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? 'Đang xóa...' : 'Xóa'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Sheet edit reader type */}
			<Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
				<SheetContent side="right" className="w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>
							Chỉnh sửa loại độc giả{' '}
							{readerTypeToEdit && getTypeNameLabel(readerTypeToEdit.typeName)}
						</SheetTitle>
					</SheetHeader>
					<div className="px-4">
						{readerTypeToEdit && (
							<EditReaderTypeForm
								readerType={readerTypeToEdit}
								onSubmit={handleUpdateReaderType}
								onCancel={handleCloseEditSheet}
								isLoading={isUpdating}
							/>
						)}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
};

export default ReaderTypesPage;
