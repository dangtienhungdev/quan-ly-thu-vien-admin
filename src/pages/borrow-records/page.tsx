import { BorrowRecordsAPI } from '@/apis';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
	BorrowStatus,
	CreateBorrowRecordRequest,
	RenewBookRequest,
	ReturnBookRequest,
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	AlertTriangle,
	BookOpen,
	Calendar,
	CheckCircle,
	Eye,
	Plus,
	Search,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
	CreateBorrowRecordDialog,
	DeleteConfirmDialog,
	RenewBookDialog,
	ReturnBookDialog,
} from './components';

export default function BorrowRecordsPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [activeTab, setActiveTab] = useState('all');
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [showReturnDialog, setShowReturnDialog] = useState(false);
	const [showRenewDialog, setShowRenewDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<any>(null);
	const [recordToDelete, setRecordToDelete] = useState<any>(null);
	const [recordToReturn, setRecordToReturn] = useState<any>(null);
	const [recordToRenew, setRecordToRenew] = useState<any>(null);

	const queryClient = useQueryClient();

	// Fetch borrow records data
	const { data: borrowRecordsData, isLoading: isLoadingBorrowRecords } =
		useQuery({
			queryKey: [
				'borrow-records',
				{ search: searchQuery, status: selectedStatus },
			],
			queryFn: () => BorrowRecordsAPI.getAll({ page: 1, limit: 20 }),
		});

	// Fetch overdue records
	const { data: overdueRecords } = useQuery({
		queryKey: ['borrow-records-overdue'],
		queryFn: () => BorrowRecordsAPI.getOverdue({ page: 1, limit: 10 }),
	});

	// Fetch statistics
	const { data: stats } = useQuery({
		queryKey: ['borrow-records-stats'],
		queryFn: () => BorrowRecordsAPI.getStats(),
	});

	// Create borrow record mutation
	const createBorrowRecordMutation = useMutation({
		mutationFn: (data: CreateBorrowRecordRequest) =>
			BorrowRecordsAPI.create(data),
		onSuccess: () => {
			toast.success('Tạo giao dịch mượn thành công!');
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
			setShowCreateDialog(false);
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi tạo giao dịch mượn');
		},
	});

	// Return book mutation
	const returnBookMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: ReturnBookRequest }) =>
			BorrowRecordsAPI.returnBook(id, data),
		onSuccess: () => {
			toast.success('Trả sách thành công!');
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-overdue'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
			setShowReturnDialog(false);
			setRecordToReturn(null);
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi trả sách');
		},
	});

	// Renew book mutation
	const renewBookMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: RenewBookRequest }) =>
			BorrowRecordsAPI.renewBook(id, data),
		onSuccess: () => {
			toast.success('Gia hạn sách thành công!');
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-due-soon'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
			setShowRenewDialog(false);
			setRecordToRenew(null);
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi gia hạn sách');
		},
	});

	// Delete borrow record mutation
	const deleteBorrowRecordMutation = useMutation({
		mutationFn: (id: string) => BorrowRecordsAPI.delete(id),
		onSuccess: () => {
			toast.success('Xóa giao dịch thành công!');
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi xóa giao dịch');
		},
	});

	const handleSearch = (value: string) => {
		setSearchQuery(value);
	};

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);
	};

	const handleCreateBorrowRecord = (data: CreateBorrowRecordRequest) => {
		createBorrowRecordMutation.mutate(data);
	};

	const handleReturnBook = (data: ReturnBookRequest) => {
		if (recordToReturn) {
			returnBookMutation.mutate({ id: recordToReturn.id, data });
		}
	};

	const handleRenewBook = (data: RenewBookRequest) => {
		if (recordToRenew) {
			renewBookMutation.mutate({ id: recordToRenew.id, data });
		}
	};

	const handleDeleteRecord = (record: any) => {
		setRecordToDelete(record);
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (recordToDelete) {
			deleteBorrowRecordMutation.mutate(recordToDelete.id);
			setShowDeleteDialog(false);
			setRecordToDelete(null);
		}
	};

	const openReturnDialog = (record: any) => {
		setRecordToReturn(record);
		setShowReturnDialog(true);
	};

	const openRenewDialog = (record: any) => {
		setRecordToRenew(record);
		setShowRenewDialog(true);
	};

	const handleReturnDialogClose = (open: boolean) => {
		setShowReturnDialog(open);
		if (!open) {
			setRecordToReturn(null);
		}
	};

	const handleRenewDialogClose = (open: boolean) => {
		setShowRenewDialog(open);
		if (!open) {
			setRecordToRenew(null);
		}
	};

	const getStatusColor = (status: BorrowStatus) => {
		const colors: Record<BorrowStatus, string> = {
			borrowed: 'bg-blue-100 text-blue-800',
			returned: 'bg-green-100 text-green-800',
			overdue: 'bg-red-100 text-red-800',
			renewed: 'bg-yellow-100 text-yellow-800',
		};
		return colors[status];
	};

	const getStatusIcon = (status: BorrowStatus) => {
		switch (status) {
			case 'borrowed':
				return <BookOpen className="h-4 w-4 text-blue-600" />;
			case 'returned':
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case 'overdue':
				return <AlertTriangle className="h-4 w-4 text-red-600" />;
			case 'renewed':
				return <Calendar className="h-4 w-4 text-yellow-600" />;
			default:
				return null;
		}
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('vi-VN');
	};

	const calculateDaysOverdue = (dueDate: string) => {
		const due = new Date(dueDate);
		const today = new Date();
		const diffTime = today.getTime() - due.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	};

	const calculateDaysUntilDue = (dueDate: string) => {
		const due = new Date(dueDate);
		const today = new Date();
		const diffTime = due.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	};

	const renderBorrowRecordRow = (record: any) => {
		return (
			<TableRow key={record.id}>
				<TableCell className="font-medium">
					{record.physicalCopy?.book?.title || 'Không có tên sách'}
				</TableCell>
				<TableCell>
					{record.reader?.fullName || 'Không có tên độc giả'}
					<br />
					<span className="text-sm text-muted-foreground">
						{record.reader?.cardNumber || 'Không có mã thẻ'}
					</span>
				</TableCell>
				<TableCell>{formatDate(record.borrow_date)}</TableCell>
				<TableCell>{formatDate(record.due_date)}</TableCell>
				<TableCell>
					<Badge className={getStatusColor(record.status)}>
						{getStatusIcon(record.status)}
						<span className="ml-1">
							{record.status === 'borrowed' && 'Đang mượn'}
							{record.status === 'returned' && 'Đã trả'}
							{record.status === 'overdue' && 'Quá hạn'}
							{record.status === 'renewed' && 'Đã gia hạn'}
						</span>
					</Badge>
				</TableCell>
				<TableCell>
					{record.status === 'overdue' && (
						<span className="text-red-600 font-medium">
							{calculateDaysOverdue(record.due_date)} ngày
						</span>
					)}
					{record.status === 'borrowed' && (
						<span className="text-blue-600 font-medium">
							{calculateDaysUntilDue(record.due_date)} ngày
						</span>
					)}
					{record.status === 'returned' && record.return_date && (
						<span className="text-green-600">
							{formatDate(record.return_date)}
						</span>
					)}
				</TableCell>
				<TableCell>{formatDate(record.return_date)}</TableCell>
				<TableCell>
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setSelectedRecord(record)}
							title="Xem chi tiết"
						>
							<Eye className="h-4 w-4" />
						</Button>
						{record.status === 'borrowed' && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => openReturnDialog(record)}
									title="Trả sách"
									disabled={returnBookMutation.isPending}
								>
									<CheckCircle className="h-4 w-4 text-green-600" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => openRenewDialog(record)}
									title="Gia hạn"
									disabled={renewBookMutation.isPending}
								>
									<Calendar className="h-4 w-4 text-blue-600" />
								</Button>
							</>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleDeleteRecord(record)}
							title="Xóa giao dịch"
							disabled={deleteBorrowRecordMutation.isPending}
						>
							<Trash2 className="h-4 w-4 text-red-600" />
						</Button>
					</div>
				</TableCell>
			</TableRow>
		);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Quản lý Mượn Trả</h1>
					<p className="text-muted-foreground">
						Theo dõi và quản lý các giao dịch mượn trả sách trong thư viện
					</p>
				</div>
				<Button onClick={() => setShowCreateDialog(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Tạo Giao dịch Mượn
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tổng số Giao dịch
						</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats?.total || 0}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Đang mượn</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{stats?.borrowed || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Đã trả</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{stats?.returned || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{stats?.overdue || 0}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4"
			>
				<TabsList>
					<TabsTrigger value="all">Tất cả Giao dịch</TabsTrigger>
					<TabsTrigger value="overdue">Quá hạn</TabsTrigger>
					<TabsTrigger value="due-soon">Sắp đến hạn</TabsTrigger>
				</TabsList>

				{/* Search and Filter */}
				<div className="flex gap-4">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Tìm kiếm giao dịch..."
								value={searchQuery}
								onChange={(e) => handleSearch(e.target.value)}
								className="pl-8"
							/>
						</div>
					</div>
					<Select value={selectedStatus} onValueChange={handleStatusFilter}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả trạng thái</SelectItem>
							<SelectItem value="borrowed">Đang mượn</SelectItem>
							<SelectItem value="returned">Đã trả</SelectItem>
							<SelectItem value="overdue">Quá hạn</SelectItem>
							<SelectItem value="renewed">Đã gia hạn</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Borrow Records List */}
				<TabsContent value="all" className="space-y-4">
					{isLoadingBorrowRecords ? (
						<div className="text-center py-8">Đang tải...</div>
					) : borrowRecordsData?.data.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							Không có giao dịch mượn sách nào
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Sách</TableHead>
										<TableHead>Độc giả</TableHead>
										<TableHead>Ngày mượn</TableHead>
										<TableHead>Hạn trả</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead>Thời gian</TableHead>
										<TableHead>Ngày trả</TableHead>
										<TableHead>Hành động</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{borrowRecordsData?.data.map((record) =>
										renderBorrowRecordRow(record)
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</TabsContent>

				<TabsContent value="overdue" className="space-y-4">
					{overdueRecords?.data.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							Không có sách quá hạn
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Sách</TableHead>
										<TableHead>Độc giả</TableHead>
										<TableHead>Ngày mượn</TableHead>
										<TableHead>Hạn trả</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead>Thời gian</TableHead>
										<TableHead>Hành động</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{overdueRecords?.data.map((record) =>
										renderBorrowRecordRow(record)
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</TabsContent>

				<TabsContent value="due-soon" className="space-y-4">
					<div className="text-center py-8 text-muted-foreground">
						Tính năng này chưa được triển khai
					</div>
				</TabsContent>
			</Tabs>

			{/* Create Borrow Record Dialog */}
			<CreateBorrowRecordDialog
				open={showCreateDialog}
				onOpenChange={setShowCreateDialog}
				onSubmit={handleCreateBorrowRecord}
				isLoading={createBorrowRecordMutation.isPending}
			/>

			{/* Return Book Dialog */}
			<ReturnBookDialog
				open={showReturnDialog}
				onOpenChange={handleReturnDialogClose}
				recordId={recordToReturn?.id || ''}
				bookTitle={recordToReturn?.physicalCopy?.book?.title}
				readerName={recordToReturn?.reader?.fullName}
				onSubmit={handleReturnBook}
				isLoading={returnBookMutation.isPending}
			/>

			{/* Renew Book Dialog */}
			<RenewBookDialog
				open={showRenewDialog}
				onOpenChange={handleRenewDialogClose}
				recordId={recordToRenew?.id || ''}
				bookTitle={recordToRenew?.physicalCopy?.book?.title}
				readerName={recordToRenew?.reader?.fullName}
				currentDueDate={recordToRenew?.due_date}
				onSubmit={handleRenewBook}
				isLoading={renewBookMutation.isPending}
			/>

			{/* Delete Confirm Dialog */}
			<DeleteConfirmDialog
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				onConfirm={confirmDelete}
				isLoading={deleteBorrowRecordMutation.isPending}
				recordTitle={recordToDelete?.physicalCopy?.book?.title}
				readerName={recordToDelete?.reader?.fullName}
			/>

			{/* Record Details Dialog - Placeholder */}
			{selectedRecord && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg w-full max-w-2xl">
						<h2 className="text-xl font-semibold mb-4">Chi tiết Giao dịch</h2>
						<div className="space-y-2">
							<p>
								<strong>Sách:</strong>{' '}
								{selectedRecord.physicalCopy?.book?.title}
							</p>
							<p>
								<strong>Độc giả:</strong> {selectedRecord.reader?.fullName}
							</p>
							<p>
								<strong>Mã thẻ:</strong> {selectedRecord.reader?.cardNumber}
							</p>
							<p>
								<strong>Barcode sách:</strong>{' '}
								{selectedRecord.physicalCopy?.barcode}
							</p>
							<p>
								<strong>Ngày mượn:</strong>{' '}
								{formatDate(selectedRecord.borrow_date)}
							</p>
							<p>
								<strong>Hạn trả:</strong> {formatDate(selectedRecord.due_date)}
							</p>
							<p>
								<strong>Trạng thái:</strong> {selectedRecord.status}
							</p>
							{selectedRecord.return_date && (
								<p>
									<strong>Ngày trả:</strong>{' '}
									{formatDate(selectedRecord.return_date)}
								</p>
							)}
							<p>
								<strong>Số lần gia hạn:</strong> {selectedRecord.renewal_count}
							</p>
							{selectedRecord.borrow_notes && (
								<p>
									<strong>Ghi chú mượn:</strong> {selectedRecord.borrow_notes}
								</p>
							)}
							{selectedRecord.return_notes && (
								<p>
									<strong>Ghi chú trả:</strong> {selectedRecord.return_notes}
								</p>
							)}
						</div>
						<div className="flex justify-end space-x-2 mt-4">
							<Button variant="outline" onClick={() => setSelectedRecord(null)}>
								Đóng
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
