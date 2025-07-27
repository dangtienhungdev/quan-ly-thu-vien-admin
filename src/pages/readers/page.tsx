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
import type {
	CreateReaderRequest,
	Reader,
	UpdateReaderRequest,
} from '@/types/readers';
import {
	IconCheck,
	IconEdit,
	IconPlus,
	IconRefresh,
	IconTrash,
	IconX,
} from '@tabler/icons-react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	useActivateReader,
	useDeactivateReader,
	useReaders,
	useUpdateReader,
} from '@/hooks/readers';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CreateReaderForm from './components/create-reader-form';
import EditReaderForm from './components/edit-reader-form';
import PaginationWrapper from '@/components/pagination-wrapper';
import { ReadersAPI } from '@/apis/readers';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';

const ReadersPage = () => {
	const [queryParams] = useSearchParams();
	const navigate = useNavigate();
	const page = queryParams.get('page');
	const limit = queryParams.get('limit');

	// State cho Sheet tạo reader
	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	// State cho dialog xóa reader
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [readerToDelete, setReaderToDelete] = useState<{
		id: string;
		fullName: string;
		cardNumber: string;
	} | null>(null);

	// State cho Sheet edit reader
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [readerToEdit, setReaderToEdit] = useState<Reader | null>(null);

	// Hook để cập nhật reader
	const { updateReader, isUpdating } = useUpdateReader({
		onSuccess: () => {
			setIsEditSheetOpen(false);
			setReaderToEdit(null);
		},
	});

	// Hook để activate/deactivate reader
	const { activateReader, isActivating } = useActivateReader();
	const { deactivateReader, isDeactivating } = useDeactivateReader();

	const { readers, meta, isLoading, isError, error, refetch } = useReaders({
		params: {
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 10,
		},
	});

	// Hàm xử lý tạo reader
	const handleCreateReader = async (data: CreateReaderRequest) => {
		try {
			setIsCreating(true);
			const newReader = await ReadersAPI.create(data);
			toast.success(`Tạo độc giả ${newReader.fullName} thành công!`);
			setIsCreateSheetOpen(false);
			refetch();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi tạo độc giả';
			toast.error(errorMessage);
		} finally {
			setIsCreating(false);
		}
	};

	// Hàm đóng Sheet
	const handleCloseSheet = () => {
		setIsCreateSheetOpen(false);
	};

	// Hàm mở dialog xóa reader
	const handleOpenDeleteDialog = (reader: {
		id: string;
		fullName: string;
		cardNumber: string;
	}) => {
		setReaderToDelete(reader);
		setIsDeleteDialogOpen(true);
	};

	// Hàm xử lý xóa reader
	const handleDeleteReader = async () => {
		if (!readerToDelete) return;

		try {
			setIsDeleting(true);
			await ReadersAPI.delete(readerToDelete.id);
			toast.success(`Xóa độc giả ${readerToDelete.fullName} thành công!`);
			setIsDeleteDialogOpen(false);
			setReaderToDelete(null);
			refetch();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi xóa độc giả';
			toast.error(errorMessage);
		} finally {
			setIsDeleting(false);
		}
	};

	// Hàm đóng dialog xóa
	const handleCloseDeleteDialog = () => {
		setIsDeleteDialogOpen(false);
		setReaderToDelete(null);
	};

	// Hàm mở Sheet edit reader
	const handleOpenEditSheet = (reader: Reader): void => {
		setReaderToEdit(reader);
		setIsEditSheetOpen(true);
	};

	// Hàm xử lý cập nhật reader
	const handleUpdateReader = (data: UpdateReaderRequest) => {
		if (!readerToEdit) return;
		updateReader({ id: readerToEdit.id, data });
	};

	// Hàm đóng Sheet edit
	const handleCloseEditSheet = () => {
		setIsEditSheetOpen(false);
		setReaderToEdit(null);
	};

	// Hàm xử lý thay đổi trang
	const handlePageChange = (newPage: number) => {
		const newParams = new URLSearchParams(queryParams);
		newParams.set('page', newPage.toString());
		navigate(`?${newParams.toString()}`);
	};

	// Hàm xử lý activate/deactivate reader
	const handleToggleStatus = (reader: Reader): void => {
		if (reader.isActive) {
			deactivateReader(reader.id);
		} else {
			activateReader(reader.id);
		}
	};

	const formatDate = (dateString: string): string => {
		return new Date(dateString).toLocaleDateString('vi-VN');
	};

	const getGenderLabel = (gender: string): string => {
		switch (gender) {
			case 'male':
				return 'Nam';
			case 'female':
				return 'Nữ';
			case 'other':
				return 'Khác';
			default:
				return gender;
		}
	};

	const getStatusBadgeVariant = (
		isActive: boolean
	): 'default' | 'secondary' => {
		return isActive ? 'default' : 'secondary';
	};

	const getStatusLabel = (isActive: boolean): string => {
		return isActive ? 'Đang hoạt động' : 'Không hoạt động';
	};

	const isCardExpired = (expiryDate: string): boolean => {
		return new Date(expiryDate) < new Date();
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
						Failed to load readers: {error?.message || 'Unknown error'}
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
				<h1 className="text-2xl font-bold tracking-tight">Quản lý độc giả</h1>
				<div className="flex items-center space-x-2">
					<Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
						<SheetTrigger asChild>
							<Button>
								<IconPlus className="mr-2 h-4 w-4" />
								Thêm độc giả
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[400px] sm:w-[540px]">
							<SheetHeader>
								<SheetTitle>Thêm độc giả mới</SheetTitle>
							</SheetHeader>
							<div className="px-4">
								<CreateReaderForm
									onSubmit={handleCreateReader}
									onCancel={handleCloseSheet}
									isLoading={isCreating}
								/>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>

			<div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Họ tên</TableHead>
							<TableHead>Số thẻ</TableHead>
							<TableHead>Thông tin cá nhân</TableHead>
							<TableHead>Loại độc giả</TableHead>
							<TableHead>Ngày cấp thẻ</TableHead>
							<TableHead>Ngày hết hạn</TableHead>
							<TableHead>Trạng thái</TableHead>
							<TableHead className="text-right">Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{readers.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="text-center py-8">
									Không tìm thấy độc giả nào
								</TableCell>
							</TableRow>
						) : (
							readers.map((reader) => (
								<TableRow key={reader.id}>
									<TableCell className="font-medium">
										{reader.fullName}
									</TableCell>
									<TableCell className="font-mono text-sm">
										{reader.cardNumber}
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="text-sm">
												<strong>Ngày sinh:</strong> {formatDate(reader.dob)}
											</div>
											<div className="text-sm">
												<strong>Giới tính:</strong>{' '}
												{getGenderLabel(reader.gender)}
											</div>
											<div className="text-sm">
												<strong>SĐT:</strong> {reader.phone}
											</div>
											<div className="text-sm text-muted-foreground max-w-xs truncate">
												<strong>Địa chỉ:</strong> {reader.address}
											</div>
										</div>
									</TableCell>
									<TableCell>
										{reader.readerType?.typeName || reader.readerTypeId}
									</TableCell>
									<TableCell>{formatDate(reader.cardIssueDate)}</TableCell>
									<TableCell>
										<div className="flex items-center space-x-2">
											<span
												className={
													isCardExpired(reader.cardExpiryDate)
														? 'text-red-600 font-medium'
														: ''
												}
											>
												{formatDate(reader.cardExpiryDate)}
											</span>
											{isCardExpired(reader.cardExpiryDate) && (
												<Badge variant="destructive" className="text-xs">
													Hết hạn
												</Badge>
											)}
										</div>
									</TableCell>
									<TableCell>
										<Badge variant={getStatusBadgeVariant(reader.isActive)}>
											{getStatusLabel(reader.isActive)}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end space-x-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleToggleStatus(reader)}
												disabled={isActivating || isDeactivating}
												className={`h-8 w-8 p-0 ${
													reader.isActive
														? 'text-orange-600 hover:text-orange-600'
														: 'text-green-600 hover:text-green-600'
												}`}
											>
												{reader.isActive ? (
													<IconX className="h-4 w-4" />
												) : (
													<IconCheck className="h-4 w-4" />
												)}
												<span className="sr-only">
													{reader.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} thẻ
													độc giả
												</span>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleOpenEditSheet(reader)}
												className="h-8 w-8 p-0 text-primary hover:text-primary"
											>
												<IconEdit className="h-4 w-4" />
												<span className="sr-only">Chỉnh sửa độc giả</span>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													handleOpenDeleteDialog({
														id: reader.id,
														fullName: reader.fullName,
														cardNumber: reader.cardNumber,
													})
												}
												className="h-8 w-8 p-0 text-destructive hover:text-destructive"
											>
												<IconTrash className="h-4 w-4" />
												<span className="sr-only">Xóa độc giả</span>
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>

				{meta && (
					<div className="mt-4 space-y-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground text-center">
							Showing {readers.length} of {meta.totalItems} readers
							{meta.totalPages > 1 && (
								<span>
									{' '}
									(Page {meta.page} of {meta.totalPages})
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

			{/* Dialog xác nhận xóa reader */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa độc giả</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa độc giả{' '}
							<strong>{readerToDelete?.fullName}</strong> (Số thẻ:{' '}
							{readerToDelete?.cardNumber})?
							<br />
							Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCloseDeleteDialog}>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteReader}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? 'Đang xóa...' : 'Xóa'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Sheet edit reader */}
			<Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
				<SheetContent side="right" className="w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>Chỉnh sửa độc giả {readerToEdit?.fullName}</SheetTitle>
					</SheetHeader>
					<div className="px-4">
						{readerToEdit && (
							<EditReaderForm
								reader={readerToEdit}
								onSubmit={handleUpdateReader}
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

export default ReadersPage;
