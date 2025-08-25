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
	usePublisherStats,
	usePublishers,
	useTogglePublisherStatus,
	useUpdatePublisher,
} from '@/hooks/publishers';
import type {
	CreatePublisherRequest,
	Publisher,
	UpdatePublisherRequest,
} from '@/types/publishers';
import {
	IconEdit,
	IconPlus,
	IconRefresh,
	IconSearch,
	IconSwitch,
	IconTrash,
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PublishersAPI } from '@/apis/publishers';
import PaginationWrapper from '@/components/pagination-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import CreatePublisherForm from './components/create-publisher-form';
import EditPublisherForm from './components/edit-publisher-form';

const PublishersPage = () => {
	const [queryParams] = useSearchParams();
	const navigate = useNavigate();
	const page = queryParams.get('page');
	const limit = queryParams.get('limit');
	const search = queryParams.get('search');

	// State cho search
	const [searchValue, setSearchValue] = useState(search || '');
	const [currentSearch, setCurrentSearch] = useState(search || '');
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Đồng bộ searchValue với URL params
	useEffect(() => {
		setSearchValue(search || '');
		setCurrentSearch(search || '');
	}, [search]);

	// Cập nhật URL khi currentSearch thay đổi
	useEffect(() => {
		const searchParams = new URLSearchParams();
		searchParams.set('page', '1'); // Reset về trang 1 khi search
		if (currentSearch) {
			searchParams.set('search', currentSearch);
		}
		navigate(`?${searchParams.toString()}`, { replace: true });
	}, [currentSearch, navigate]);

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

	// Hook để cập nhật publisher
	const { updatePublisher, isUpdating } = useUpdatePublisher({
		onSuccess: () => {
			setIsEditSheetOpen(false);
			setPublisherToEdit(null);
		},
	});

	// Hook để toggle status
	const { toggleStatus, isToggling } = useTogglePublisherStatus();

	const params: any = {
		page: page ? Number(page) : 1,
		limit: limit ? Number(limit) : 10,
	};

	if (currentSearch) {
		params.search = currentSearch;
	}

	const { publishers, meta, isLoading, isError, error, refetch } =
		usePublishers({
			params,
		});

	// Hàm xử lý search - chỉ cập nhật state
	const handleSearchChange = (value: string) => {
		setSearchValue(value);
	};

	// Hàm thực hiện search
	const handleSearch = () => {
		setCurrentSearch(searchValue);
		// Giữ focus cho input
		searchInputRef.current?.focus();
	};

	// Hàm xử lý khi nhấn Enter
	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	// Hook để lấy thống kê
	const { stats } = usePublisherStats();

	// Hàm xử lý tạo publisher
	const handleCreatePublisher = async (data: CreatePublisherRequest) => {
		try {
			setIsCreating(true);
			const newPublisher = await PublishersAPI.create(data);
			toast.success(
				`Tạo nhà xuất bản ${newPublisher.publisherName} thành công!`
			);
			setIsCreateSheetOpen(false);
			refetch();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi tạo nhà xuất bản';
			toast.error(errorMessage);
		} finally {
			setIsCreating(false);
		}
	};

	// Hàm đóng Sheet
	const handleCloseSheet = () => {
		setIsCreateSheetOpen(false);
	};

	// Hàm mở dialog xóa publisher
	const handleOpenDeleteDialog = (publisher: {
		id: string;
		publisherName: string;
		description?: string;
	}) => {
		setPublisherToDelete(publisher);
		setIsDeleteDialogOpen(true);
	};

	// Hàm xử lý xóa publisher
	const handleDeletePublisher = async () => {
		if (!publisherToDelete) return;

		try {
			setIsDeleting(true);
			await PublishersAPI.delete(publisherToDelete.id);
			toast.success(
				`Xóa nhà xuất bản ${publisherToDelete.publisherName} thành công!`
			);
			setIsDeleteDialogOpen(false);
			setPublisherToDelete(null);
			refetch();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi xóa nhà xuất bản';
			toast.error(errorMessage);
		} finally {
			setIsDeleting(false);
		}
	};

	// Hàm đóng dialog xóa
	const handleCloseDeleteDialog = () => {
		setIsDeleteDialogOpen(false);
		setPublisherToDelete(null);
	};

	// Hàm mở Sheet edit publisher
	const handleOpenEditSheet = (publisher: Publisher) => {
		setPublisherToEdit(publisher);
		setIsEditSheetOpen(true);
	};

	// Hàm xử lý cập nhật publisher
	const handleUpdatePublisher = (data: UpdatePublisherRequest) => {
		if (!publisherToEdit) return;
		updatePublisher({ id: publisherToEdit.id, data });
	};

	// Hàm đóng Sheet edit
	const handleCloseEditSheet = () => {
		setIsEditSheetOpen(false);
		setPublisherToEdit(null);
	};

	// Hàm xử lý thay đổi trang
	const handlePageChange = (newPage: number) => {
		const searchParams = new URLSearchParams();
		searchParams.set('page', newPage.toString());
		if (currentSearch) {
			searchParams.set('search', currentSearch);
		}
		navigate(`?${searchParams.toString()}`);
	};

	// Hàm xử lý toggle status
	const handleToggleStatus = (publisher: Publisher): void => {
		toggleStatus(publisher.id);
	};

	const getStatusBadgeVariant = (
		isActive: boolean
	): 'default' | 'secondary' => {
		return isActive ? 'default' : 'secondary';
	};

	const getStatusLabel = (isActive: boolean): string => {
		return isActive ? 'Đang hoạt động' : 'Không hoạt động';
	};

	const formatDate = (dateString?: string): string => {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('vi-VN');
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
						Failed to load publishers: {error?.message || 'Unknown error'}
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
					Quản lý nhà xuất bản
				</h1>
				<div className="flex items-center space-x-2">
					<Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
						<SheetTrigger asChild>
							<Button>
								<IconPlus className="mr-2 h-4 w-4" />
								Thêm nhà xuất bản
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[400px] sm:w-[540px]">
							<SheetHeader>
								<SheetTitle>Thêm nhà xuất bản mới</SheetTitle>
							</SheetHeader>
							<div className="px-4">
								<CreatePublisherForm
									onSubmit={handleCreatePublisher}
									onCancel={handleCloseSheet}
									isLoading={isCreating}
								/>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>

			{/* Search Input */}
			<div className="mb-4">
				<div className="flex gap-2">
					<div className="relative flex-1">
						<IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							ref={searchInputRef}
							placeholder="Tìm kiếm theo tên, địa chỉ, email, điện thoại hoặc quốc gia..."
							value={searchValue}
							onChange={(e) => handleSearchChange(e.target.value)}
							onKeyPress={handleKeyPress}
							className="pl-10"
						/>
					</div>
					<Button
						onClick={handleSearch}
						disabled={searchValue === currentSearch}
						className="px-6"
					>
						<IconSearch className="mr-2 h-4 w-4" />
						Tìm kiếm
					</Button>
				</div>
			</div>

			{/* Thống kê */}
			{stats && (
				<div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<p className="text-sm font-medium">Tổng số</p>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.total}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<p className="text-sm font-medium">Đang hoạt động</p>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								{stats.active}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<p className="text-sm font-medium">Không hoạt động</p>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-gray-600">
								{stats.inactive}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<p className="text-sm font-medium">Quốc gia</p>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.byCountry.length}</div>
						</CardContent>
					</Card>
				</div>
			)}

			<div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tên nhà xuất bản</TableHead>
							<TableHead>Slug</TableHead>
							<TableHead>Địa chỉ</TableHead>
							<TableHead>Liên hệ</TableHead>
							<TableHead>Quốc gia</TableHead>
							<TableHead>Ngày thành lập</TableHead>
							<TableHead>Trạng thái</TableHead>
							<TableHead className="text-right">Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{publishers.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="text-center py-8">
									{currentSearch
										? `Không tìm thấy nhà xuất bản nào phù hợp với "${currentSearch}"`
										: 'Không có nhà xuất bản nào'}
								</TableCell>
							</TableRow>
						) : (
							publishers.map((publisher) => (
								<TableRow key={publisher.id}>
									<TableCell className="font-medium">
										{publisher.publisherName}
									</TableCell>
									<TableCell className="font-mono text-sm">
										{publisher.slug}
									</TableCell>
									<TableCell className="max-w-xs truncate">
										{publisher.address}
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="text-sm">{publisher.phone}</div>
											<div className="text-sm text-muted-foreground">
												{publisher.email}
											</div>
											{publisher.website && (
												<a
													href={publisher.website}
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm text-blue-600 hover:underline"
												>
													Website
												</a>
											)}
										</div>
									</TableCell>
									<TableCell>{publisher.country || '-'}</TableCell>
									<TableCell>{formatDate(publisher.establishedDate)}</TableCell>
									<TableCell>
										<Badge variant={getStatusBadgeVariant(publisher.isActive)}>
											{getStatusLabel(publisher.isActive)}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end space-x-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleToggleStatus(publisher)}
												disabled={isToggling}
												className="h-8 w-8 p-0 text-orange-600 hover:text-orange-600"
											>
												<IconSwitch className="h-4 w-4" />
												<span className="sr-only">Chuyển đổi trạng thái</span>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleOpenEditSheet(publisher)}
												className="h-8 w-8 p-0 text-primary hover:text-primary"
											>
												<IconEdit className="h-4 w-4" />
												<span className="sr-only">Chỉnh sửa nhà xuất bản</span>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													handleOpenDeleteDialog({
														id: publisher.id,
														publisherName: publisher.publisherName,
														description: publisher.description,
													})
												}
												className="h-8 w-8 p-0 text-destructive hover:text-destructive"
											>
												<IconTrash className="h-4 w-4" />
												<span className="sr-only">Xóa nhà xuất bản</span>
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
							Showing {publishers.length} of {meta.totalItems} publishers
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

			{/* Dialog xác nhận xóa publisher */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa nhà xuất bản</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa nhà xuất bản{' '}
							<strong>{publisherToDelete?.publisherName}</strong>?
							<br />
							Hành động này không thể hoàn tác.
							{publisherToDelete?.description && (
								<>
									<br />
									<strong>Mô tả:</strong> {publisherToDelete.description}
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCloseDeleteDialog}>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeletePublisher}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? 'Đang xóa...' : 'Xóa'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Sheet edit publisher */}
			<Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
				<SheetContent side="right" className="w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>
							Chỉnh sửa nhà xuất bản {publisherToEdit?.publisherName}
						</SheetTitle>
					</SheetHeader>
					<div className="px-4">
						{publisherToEdit && (
							<EditPublisherForm
								publisher={publisherToEdit}
								onSubmit={handleUpdatePublisher}
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

export default PublishersPage;
