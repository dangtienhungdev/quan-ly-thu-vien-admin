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
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
	useActivateReader,
	useDeactivateReader,
	useReaders,
	useSearchReaders,
	useUpdateReader,
} from '@/hooks/readers';
import type {
	CreateReaderRequest,
	Reader,
	UpdateReaderRequest,
} from '@/types/readers';
import {
	IconCalendar,
	IconCheck,
	IconEdit,
	IconRefresh,
	IconSearch,
	IconTrash,
	IconX,
} from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ReadersAPI } from '@/apis/readers';
import PaginationWrapper from '@/components/pagination-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { toast } from 'sonner';
import CreateReaderForm from './components/create-reader-form';
import EditReaderForm from './components/edit-reader-form';

const ReadersPage = () => {
	const [queryParams] = useSearchParams();
	const navigate = useNavigate();
	const page = queryParams.get('page');
	const limit = queryParams.get('limit');
	const searchQuery = queryParams.get('q');
	const cardNumberFilter = queryParams.get('cardNumber');
	const phoneFilter = queryParams.get('phone');
	const cardExpiryDateFrom = queryParams.get('cardExpiryDateFrom');
	const cardExpiryDateTo = queryParams.get('cardExpiryDateTo');
	const activeTab = queryParams.get('tab') || 'all';

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

	// State cho search và filter
	const [searchTerm, setSearchTerm] = useState(searchQuery || '');
	const [selectedCardNumber, setSelectedCardNumber] = useState(
		cardNumberFilter || ''
	);
	const [selectedPhone, setSelectedPhone] = useState(phoneFilter || '');
	const [selectedExpiryDateFrom, setSelectedExpiryDateFrom] = useState(
		cardExpiryDateFrom || ''
	);
	const [selectedExpiryDateTo, setSelectedExpiryDateTo] = useState(
		cardExpiryDateTo || ''
	);

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

	// Hook để cập nhật reader (dùng cho gia hạn thẻ)
	const { updateReader: updateReaderForRenewal, isUpdating: isRenewing } =
		useUpdateReader({
			onSuccess: (updatedReader) => {
				// Custom success message for card renewal
				toast.success(
					`Đã gia hạn thẻ thành công! Ngày cấp: ${updatedReader.cardIssueDate}, Hết hạn: ${updatedReader.cardExpiryDate}`
				);
			},
		});

	// Hook để lấy danh sách readers (tab "Tất cả")
	const { readers, meta, isLoading, isError, error, refetch } = useReaders({
		params: {
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 10,
			cardNumber: cardNumberFilter || undefined,
			phone: phoneFilter || undefined,
			cardExpiryDateFrom: cardExpiryDateFrom || undefined,
			cardExpiryDateTo: cardExpiryDateTo || undefined,
		},
		enabled: !searchQuery && activeTab === 'all',
	});

	// Hook để lấy danh sách readers đợi phê duyệt (tab "Đợi phê duyệt")
	const {
		readers: pendingReaders,
		meta: pendingMeta,
		isLoading: isPendingLoading,
		isError: isPendingError,
		error: pendingError,
		refetch: refetchPending,
	} = useReaders({
		params: {
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 10,
			cardExpiryDateFrom: '1969-01-01',
			cardExpiryDateTo: '1969-12-31',
		},
		enabled: activeTab === 'pending',
	});

	// Hook để tìm kiếm readers
	const {
		readers: searchResults,
		meta: searchMeta,
		isLoading: isSearching,
		isError: isSearchError,
		error: searchError,
	} = useSearchReaders({
		params: {
			q: searchQuery || '',
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 10,
		},
		enabled: !!searchQuery && activeTab === 'all',
	});

	// Hàm xử lý tạo reader
	const handleCreateReader = async (data: CreateReaderRequest) => {
		try {
			setIsCreating(true);
			const newReader = await ReadersAPI.create(data);
			toast.success(`Tạo độc giả ${newReader.fullName} thành công!`);
			setIsCreateSheetOpen(false);
			refetch();
			if (activeTab === 'pending') {
				refetchPending();
			}
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
			if (activeTab === 'pending') {
				refetchPending();
			}
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

	// Hàm xử lý thay đổi tab
	const handleTabChange = (value: string) => {
		const newParams = new URLSearchParams();
		newParams.set('tab', value);
		newParams.set('page', '1');
		navigate(`?${newParams.toString()}`);
	};

	// Hàm xử lý tìm kiếm
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const newParams = new URLSearchParams();
		newParams.set('tab', activeTab);
		if (searchTerm.trim()) {
			newParams.set('q', searchTerm.trim());
		}
		if (selectedCardNumber.trim()) {
			newParams.set('cardNumber', selectedCardNumber.trim());
		}
		if (selectedPhone.trim()) {
			newParams.set('phone', selectedPhone.trim());
		}
		if (selectedExpiryDateFrom) {
			newParams.set('cardExpiryDateFrom', selectedExpiryDateFrom);
		}
		if (selectedExpiryDateTo) {
			newParams.set('cardExpiryDateTo', selectedExpiryDateTo);
		}
		newParams.set('page', '1');
		navigate(`?${newParams.toString()}`);
	};

	// Hàm xử lý xóa tìm kiếm và filter
	const handleClearSearch = () => {
		setSearchTerm('');
		setSelectedCardNumber('');
		setSelectedPhone('');
		setSelectedExpiryDateFrom('');
		setSelectedExpiryDateTo('');
		const newParams = new URLSearchParams();
		newParams.set('tab', activeTab);
		newParams.set('page', '1');
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

	// Hàm xử lý gia hạn thẻ
	const handleRenewCard = (reader: Reader): void => {
		const today = new Date();
		const newExpiryDate = new Date();
		newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1); // Gia hạn thêm 1 năm

		updateReaderForRenewal({
			id: reader.id,
			data: {
				cardIssueDate: today.toISOString().split('T')[0], // Ngày phê duyệt = hôm nay
				cardExpiryDate: newExpiryDate.toISOString().split('T')[0], // Hết hạn = 1 năm sau
			},
		});
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

	// Lấy dữ liệu hiện tại dựa trên tab và search
	const getCurrentData = () => {
		if (activeTab === 'pending') {
			return {
				readers: pendingReaders,
				meta: pendingMeta,
				isLoading: isPendingLoading,
				isError: isPendingError,
				error: pendingError,
				refetch: refetchPending,
			};
		}

		if (searchQuery) {
			return {
				readers: searchResults,
				meta: searchMeta,
				isLoading: isSearching,
				isError: isSearchError,
				error: searchError,
				refetch: refetch,
			};
		}

		return {
			readers,
			meta,
			isLoading,
			isError,
			error,
			refetch,
		};
	};

	const currentData = getCurrentData();

	// Kiểm tra có filter nào đang active không (chỉ cho tab "Tất cả")
	const hasActiveFilters =
		activeTab === 'all' &&
		(searchQuery ||
			cardNumberFilter ||
			phoneFilter ||
			cardExpiryDateFrom ||
			cardExpiryDateTo);

	if (currentData.isLoading) {
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

	if (currentData.isError) {
		return (
			<div className="container mx-auto py-6">
				<Alert variant="destructive">
					<AlertDescription>
						Failed to load readers:{' '}
						{currentData.error?.message || 'Unknown error'}
					</AlertDescription>
				</Alert>
				<Button onClick={() => currentData.refetch()} className="mt-4">
					<IconRefresh className="mr-2 h-4 w-4" />
					Retry
				</Button>
			</div>
		);
	}

	const renderReadersTable = () => (
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
				{currentData.readers.length === 0 ? (
					<TableRow>
						<TableCell colSpan={8} className="text-center py-8">
							{activeTab === 'pending'
								? 'Không có độc giả nào đợi phê duyệt'
								: hasActiveFilters
								? 'Không tìm thấy độc giả nào phù hợp với bộ lọc'
								: 'Không tìm thấy độc giả nào'}
						</TableCell>
					</TableRow>
				) : (
					currentData.readers.map((reader) => (
						<TableRow key={reader.id}>
							<TableCell className="font-medium">{reader.fullName}</TableCell>
							<TableCell className="font-mono text-sm">
								{reader.cardNumber}
							</TableCell>
							<TableCell>
								<div className="space-y-1">
									<div className="text-sm">
										<strong>Ngày sinh:</strong> {formatDate(reader.dob)}
									</div>
									<div className="text-sm">
										<strong>Giới tính:</strong> {getGenderLabel(reader.gender)}
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
									{/* Nút gia hạn thẻ - chỉ hiển thị ở tab "Đợi phê duyệt" */}
									{activeTab === 'pending' &&
										isCardExpired(reader.cardExpiryDate) && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleRenewCard(reader)}
												disabled={isRenewing}
												className="h-8 w-8 p-0 text-blue-600 hover:text-blue-600"
												title="Gia hạn thẻ: Cập nhật ngày cấp = hôm nay, hết hạn = 1 năm sau"
											>
												<IconCalendar className="h-4 w-4" />
												<span className="sr-only">Gia hạn thẻ</span>
											</Button>
										)}
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
											{reader.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} thẻ độc
											giả
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
	);

	return (
		<>
			<div className="mb-2 flex items-center justify-between space-y-2">
				<h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
					Quản lý độc giả
					{meta && (
						<Badge
							variant="secondary"
							className="ml-2 text-xs bg-primary text-white"
						>
							{meta.totalItems} độc giả
						</Badge>
					)}
				</h1>
				<div className="flex items-center space-x-2">
					<Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
						{/* <SheetTrigger asChild>
							<Button>
								<IconPlus className="mr-2 h-4 w-4" />
								Thêm độc giả
							</Button>
						</SheetTrigger> */}
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

			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className="space-y-4"
			>
				{/* <TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="all">
						Tất cả độc giả
						{meta && (
							<Badge variant="secondary" className="ml-2 text-xs">
								{meta.totalItems}
							</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value="pending">
						Đợi phê duyệt
						{pendingMeta && (
							<Badge variant="secondary" className="ml-2 text-xs">
								{pendingMeta.totalItems}
							</Badge>
						)}
					</TabsTrigger>
				</TabsList> */}

				<TabsContent value="all" className="space-y-4">
					{/* Search Bar và Filter chỉ hiển thị ở tab "Tất cả" */}
					<div className="mb-4 space-y-4">
						<form onSubmit={handleSearch} className="space-y-4">
							{/* Search chính */}
							<div className="flex space-x-2">
								<div className="flex-1">
									<Input
										placeholder="Tìm kiếm độc giả theo tên, số thẻ, SĐT, username, email..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>
								<Button type="submit" disabled={!searchTerm.trim()}>
									<IconSearch className="mr-2 h-4 w-4" />
									Tìm kiếm
								</Button>
								{hasActiveFilters && (
									<Button
										type="button"
										variant="outline"
										onClick={handleClearSearch}
									>
										Xóa bộ lọc
									</Button>
								)}
							</div>

							{/* Filters */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<div>
									<label className="text-sm font-medium">
										Số thẻ thư viện:
									</label>
									<Input
										placeholder="Nhập số thẻ..."
										value={selectedCardNumber}
										onChange={(e) => setSelectedCardNumber(e.target.value)}
										className="mt-1"
									/>
								</div>
								<div>
									<label className="text-sm font-medium">Số điện thoại:</label>
									<Input
										placeholder="Nhập số điện thoại..."
										value={selectedPhone}
										onChange={(e) => setSelectedPhone(e.target.value)}
										className="mt-1"
									/>
								</div>
								<div>
									<label className="text-sm font-medium">
										Ngày hết hạn từ:
									</label>
									<Input
										type="date"
										value={selectedExpiryDateFrom}
										onChange={(e) => setSelectedExpiryDateFrom(e.target.value)}
										className="mt-1"
									/>
								</div>
								<div>
									<label className="text-sm font-medium">
										Ngày hết hạn đến:
									</label>
									<Input
										type="date"
										value={selectedExpiryDateTo}
										onChange={(e) => setSelectedExpiryDateTo(e.target.value)}
										className="mt-1"
									/>
								</div>
							</div>

							{/* Nút áp dụng filter */}
							<div className="flex justify-end">
								<Button type="submit" variant="outline">
									Áp dụng bộ lọc
								</Button>
							</div>
						</form>

						{/* Hiển thị thông tin filter hiện tại */}
						{hasActiveFilters && (
							<div className="flex items-center space-x-2 text-sm text-muted-foreground">
								<span>Bộ lọc hiện tại:</span>
								{searchQuery && (
									<Badge variant="outline" className="text-xs">
										Tìm kiếm: "{searchQuery}"
									</Badge>
								)}
								{cardNumberFilter && (
									<Badge variant="outline" className="text-xs">
										Số thẻ: "{cardNumberFilter}"
									</Badge>
								)}
								{phoneFilter && (
									<Badge variant="outline" className="text-xs">
										SĐT: "{phoneFilter}"
									</Badge>
								)}
								{cardExpiryDateFrom && (
									<Badge variant="outline" className="text-xs">
										Hết hạn từ: {cardExpiryDateFrom}
									</Badge>
								)}
								{cardExpiryDateTo && (
									<Badge variant="outline" className="text-xs">
										Hết hạn đến: {cardExpiryDateTo}
									</Badge>
								)}
							</div>
						)}
					</div>

					<div>{renderReadersTable()}</div>
				</TabsContent>

				<TabsContent value="pending" className="space-y-4">
					<div className="mb-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2 text-sm text-muted-foreground">
								<span>Hiển thị độc giả có thẻ hết hạn trong năm 1969</span>
								<Badge variant="outline" className="text-xs">
									Từ: 1969-01-01 đến: 1969-12-31
								</Badge>
								<span className="text-xs text-blue-600">
									💡 Gia hạn: Ngày cấp = hôm nay, Hết hạn = 1 năm sau
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										// Gia hạn tất cả thẻ hết hạn
										const expiredReaders = currentData.readers.filter(
											(reader) => isCardExpired(reader.cardExpiryDate)
										);
										if (expiredReaders.length === 0) {
											toast.info('Không có thẻ nào cần gia hạn');
											return;
										}

										toast.promise(
											Promise.all(
												expiredReaders.map((reader) => {
													return new Promise((resolve, reject) => {
														updateReaderForRenewal(
															{
																id: reader.id,
																data: {
																	cardIssueDate: new Date()
																		.toISOString()
																		.split('T')[0],
																	cardExpiryDate: new Date(
																		Date.now() + 365 * 24 * 60 * 60 * 1000
																	)
																		.toISOString()
																		.split('T')[0],
																},
															},
															{
																onSuccess: resolve,
																onError: reject,
															}
														);
													});
												})
											),
											{
												loading: `Đang gia hạn ${expiredReaders.length} thẻ...`,
												success: `Đã gia hạn thành công ${expiredReaders.length} thẻ (ngày cấp: hôm nay, hết hạn: 1 năm sau)`,
												error: 'Có lỗi xảy ra khi gia hạn thẻ',
											}
										);
									}}
									disabled={
										currentData.readers.filter((reader) =>
											isCardExpired(reader.cardExpiryDate)
										).length === 0
									}
								>
									<IconCalendar className="mr-2 h-4 w-4" />
									Gia hạn tất cả
								</Button>
							</div>
						</div>
					</div>

					<div>{renderReadersTable()}</div>
				</TabsContent>
			</Tabs>

			{currentData.meta && (
				<div className="mt-4 space-y-4 flex items-center justify-between">
					<div className="text-sm text-muted-foreground text-center">
						Hiển thị {currentData.readers.length} trên{' '}
						{currentData.meta.totalItems} readers
						{currentData.meta.totalPages > 1 && (
							<span>
								{' '}
								(Trang {currentData.meta.page} trên{' '}
								{currentData.meta.totalPages})
							</span>
						)}
					</div>

					<div>
						{currentData.meta.totalPages > 1 && (
							<PaginationWrapper
								currentPage={currentData.meta.page}
								totalPages={currentData.meta.totalPages}
								onPageChange={handlePageChange}
							/>
						)}
					</div>
				</div>
			)}

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
