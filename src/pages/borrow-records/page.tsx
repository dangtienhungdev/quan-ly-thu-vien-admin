import { ReservationsAPI } from '@/apis/reservations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	useApproveBorrowRecord,
	useBorrowRecordsByStatus,
	useBorrowRecordsStats,
	useCreateBorrowRecord,
	useDeleteBorrowRecord,
	useRejectBorrowRecord,
	useRenewBook,
	useReturnBook,
	useSendReminders,
} from '@/hooks/borrow-records';
import { useUpdatePhysicalCopyStatus } from '@/hooks/physical-copies';
import type { BorrowStatus } from '@/types/borrow-records';
import { useQueryClient } from '@tanstack/react-query';
import {
	AlertTriangle,
	Bell,
	BookOpen,
	Calendar,
	CheckCircle,
	Eye,
	Plus,
	ThumbsUp,
} from 'lucide-react';
import { useState } from 'react';
import {
	createSearchParams,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import {
	ApproveRejectDialog,
	CreateBorrowRecordDialog,
	DeleteConfirmDialog,
	RenewBookDialog,
	ReturnBookDialog,
	StatisticsCards,
} from './components';

export default function BorrowRecordsPage() {
	const navigate = useNavigate();

	const [params] = useSearchParams();
	const status = params.get('status') || 'all';
	const page = params.get('page') || '1';
	const limit = params.get('limit') || '20';

	const queryClient = useQueryClient();

	const borrowRecordStatus = {
		status: status as BorrowStatus,
		page: Number(page),
		limit: Number(limit),
	};

	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [showReturnDialog, setShowReturnDialog] = useState(false);
	const [showRenewDialog, setShowRenewDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showApproveRejectDialog, setShowApproveRejectDialog] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<any>(null);
	const [recordToDelete, setRecordToDelete] = useState<any>(null);
	const [recordToReturn, setRecordToReturn] = useState<any>(null);
	const [recordToRenew, setRecordToRenew] = useState<any>(null);
	const [recordToApproveReject, setRecordToApproveReject] = useState<any>(null);
	const [approveRejectAction, setApproveRejectAction] = useState<
		'approve' | 'reject'
	>('approve');
	const [pendingReservationsByBook, setPendingReservationsByBook] = useState<
		Record<string, boolean>
	>({});
	const [approvedBooks, setApprovedBooks] = useState<Record<string, boolean>>(
		{}
	);

	// Hooks for different data sources
	const { stats } = useBorrowRecordsStats();

	// Hook cho filter theo status
	const {
		borrowRecords: statusRecords,
		meta: statusMeta,
		isLoading: isLoadingStatus,
	} = useBorrowRecordsByStatus({
		params: borrowRecordStatus,
		enabled: true, // Luôn enable để phản ứng với thay đổi params
	});

	// Mutation hooks
	const { createBorrowRecord, isCreating } = useCreateBorrowRecord();
	const { returnBook, isReturning } = useReturnBook();
	const { renewBook, isRenewing } = useRenewBook();
	const { deleteBorrowRecord, isDeleting } = useDeleteBorrowRecord();
	const { approveBorrowRecord, isApproving } = useApproveBorrowRecord();
	const { rejectBorrowRecord, isRejecting } = useRejectBorrowRecord();

	// New hooks for reservation and physical copy management
	const updatePhysicalCopyStatusMutation = useUpdatePhysicalCopyStatus();
	const { mutate: sendReminders, isPending: isSendingReminders } =
		useSendReminders();

	// Helper function to get current data based on active tab and filters
	const getCurrentData = () => {
		// Sử dụng statusRecords cho tất cả các tab vì hook useBorrowRecordsByStatus đã được enable
		return {
			records: statusRecords,
			meta: statusMeta,
			isLoading: isLoadingStatus,
		};
	};

	const { records, isLoading } = getCurrentData();

	const handleCreateBorrowRecord = (data: any) => {
		createBorrowRecord(data, {
			onSuccess: () => {
				setShowCreateDialog(false);

				// Invalidate queries to refresh data
				queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
				queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
				queryClient.invalidateQueries({
					queryKey: ['borrow-records-by-status', borrowRecordStatus],
				});
				queryClient.invalidateQueries({
					queryKey: ['borrow-records-by-status', borrowRecordStatus],
				});
			},
		});
	};

	const handleReturnBook = async (data: any) => {
		if (recordToReturn) {
			try {
				// First, return the borrow record
				await returnBook(
					{ id: recordToReturn.id, data },
					{
						onSuccess: () => {
							setShowReturnDialog(false);
							setRecordToReturn(null);

							// Invalidate queries to refresh data
							queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
							queryClient.invalidateQueries({
								queryKey: ['borrow-records-stats'],
							});
							queryClient.invalidateQueries({
								queryKey: ['borrow-records-by-status', borrowRecordStatus],
							});
						},
					}
				);

				// Then, update physical copy status to 'available'
				const physicalCopyId = recordToReturn.physicalCopy?.id;
				if (physicalCopyId) {
					await updatePhysicalCopyStatusMutation.mutateAsync({
						id: physicalCopyId,
						data: {
							status: 'available',
							notes: 'Sách đã được trả và sẵn sàng cho mượn',
						},
					});
				}
			} catch (error) {
				console.error('Error during return process:', error);
				// Still try to return the borrow record even if physical copy update fails
				returnBook(
					{ id: recordToReturn.id, data },
					{
						onSuccess: () => {
							setShowReturnDialog(false);
							setRecordToReturn(null);
						},
					}
				);
			}
		}
	};

	const handleRenewBook = async (data: any) => {
		if (recordToRenew) {
			try {
				// Renew the borrow record
				await renewBook(
					{ id: recordToRenew.id, data },
					{
						onSuccess: () => {
							setShowRenewDialog(false);
							setRecordToRenew(null);

							// Invalidate queries to refresh data
							queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
							queryClient.invalidateQueries({
								queryKey: ['borrow-records-stats'],
							});
							queryClient.invalidateQueries({
								queryKey: ['borrow-records-by-status', borrowRecordStatus],
							});
						},
					}
				);

				// Update physical copy status to 'borrowed' (still borrowed but renewed)
				const physicalCopyId = recordToRenew.physicalCopy?.id;
				if (physicalCopyId) {
					await updatePhysicalCopyStatusMutation.mutateAsync({
						id: physicalCopyId,
						data: {
							status: 'borrowed',
							notes: 'Sách đã được gia hạn thời gian mượn',
						},
					});
				}
			} catch (error) {
				console.error('Error during renew process:', error);
				// Still try to renew the borrow record even if physical copy update fails
				renewBook(
					{ id: recordToRenew.id, data },
					{
						onSuccess: () => {
							setShowRenewDialog(false);
							setRecordToRenew(null);
						},
					}
				);
			}
		}
	};

	const handleDeleteRecord = (record: any) => {
		setRecordToDelete(record);
		setShowDeleteDialog(true);
	};

	const confirmDelete = () => {
		if (recordToDelete) {
			deleteBorrowRecord(recordToDelete.id, {
				onSuccess: () => {
					setShowDeleteDialog(false);
					setRecordToDelete(null);

					// Invalidate queries to refresh data
					queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
					queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
					queryClient.invalidateQueries({
						queryKey: ['borrow-records-by-status', borrowRecordStatus],
					});
				},
			});
		}
	};

	const handleApproveRecord = (record: any) => {
		setRecordToApproveReject(record);
		setApproveRejectAction('approve');
		setShowApproveRejectDialog(true);
	};

	const handleRejectRecord = (record: any) => {
		setRecordToApproveReject(record);
		setApproveRejectAction('reject');
		setShowApproveRejectDialog(true);
	};

	const handleApproveRejectSubmit = async (data: any) => {
		if (approveRejectAction === 'approve') {
			try {
				// First, get pending reservations for this book
				const bookId = recordToApproveReject.physicalCopy?.book?.id;

				// Finally, approve the borrow record
				approveBorrowRecord(
					{
						id: recordToApproveReject.id,
						data,
					},
					{
						onSuccess: async () => {
							if (bookId) {
								// Get pending reservations for this book
								const pendingReservationsResponse =
									await ReservationsAPI.getByBook({
										bookId,
										page: 1,
										limit: 100,
									});

								const pendingReservations =
									pendingReservationsResponse.data.filter(
										(reservation) => reservation.status === 'pending'
									);

								// Check if there are other pending borrow records for the same book
								const otherPendingBorrowRecords = records.filter(
									(record) =>
										record.status === 'pending_approval' &&
										record.id !== recordToApproveReject.id &&
										record.physicalCopy?.book?.id === bookId
								);

								// Mark this book as approved to disable approve buttons for other records
								setApprovedBooks((prev) => ({
									...prev,
									[bookId]: true,
								}));

								// If there are pending reservations, create bulk reservations for them
								// if (pendingReservations.length > 0) {
								// const bulkReservationsData = {
								// 	reservations: pendingReservations.map((reservation) => ({
								// 		reader_id: reservation.reader_id,
								// 		book_id: reservation.book_id,
								// 		reservation_date: new Date().toISOString(),
								// 		expiry_date: new Date(
								// 			Date.now() + 7 * 24 * 60 * 60 * 1000
								// 		).toISOString(), // 7 days from now
								// 		reader_notes: 'Tự động tạo từ yêu cầu mượn sách',
								// 		priority: 1,
								// 	})),
								// };
								// console.log(
								// 	'🚀 ~ handleApproveRejectSubmit ~ bulkReservationsData:',
								// 	bulkReservationsData
								// );

								// // Create bulk reservations
								// await createBulkReservationsMutation.mutateAsync(
								// 	bulkReservationsData
								// );
								// }
							}
							setShowApproveRejectDialog(false);
							setRecordToApproveReject(null);

							// Invalidate queries to refresh data
							queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
							queryClient.invalidateQueries({
								queryKey: ['borrow-records-stats'],
							});
							queryClient.invalidateQueries({
								queryKey: ['borrow-records-by-status', borrowRecordStatus],
							});
						},
					}
				);

				// Update physical copy status to 'borrowed'
				const physicalCopyId = recordToApproveReject.physicalCopy?.id;
				if (physicalCopyId) {
					await updatePhysicalCopyStatusMutation.mutateAsync({
						id: physicalCopyId,
						data: {
							status: 'borrowed',
							notes: 'Đang được mượn bởi độc giả',
						},
					});
				}
			} catch (error) {
				console.error('Error during approval process:', error);
				// Still try to approve the borrow record even if other operations fail
				approveBorrowRecord(
					{
						id: recordToApproveReject.id,
						data,
					},
					{
						onSuccess: () => {
							setShowApproveRejectDialog(false);
							setRecordToApproveReject(null);
						},
					}
				);
			}
		} else {
			rejectBorrowRecord(
				{
					id: recordToApproveReject.id,
					data,
				},
				{
					onSuccess: () => {
						setShowApproveRejectDialog(false);
						setRecordToApproveReject(null);

						// Invalidate queries to refresh data
						queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
						queryClient.invalidateQueries({
							queryKey: ['borrow-records-stats'],
						});
						queryClient.invalidateQueries({
							queryKey: ['borrow-records-by-status', borrowRecordStatus],
						});
					},
				}
			);
		}
	};

	const handleApproveRejectDialogClose = (open: boolean) => {
		setShowApproveRejectDialog(open);
		if (!open) {
			setRecordToApproveReject(null);
			// Reset approved books state when dialog closes
			setApprovedBooks({});
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
			pending_approval: 'bg-yellow-100 text-yellow-800',
			borrowed: 'bg-blue-100 text-blue-800',
			returned: 'bg-green-100 text-green-800',
			overdue: 'bg-red-100 text-red-800',
			renewed: 'bg-purple-100 text-purple-800',
		};
		return colors[status];
	};

	const getStatusIcon = (status: BorrowStatus) => {
		switch (status) {
			case 'pending_approval':
				return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
			case 'borrowed':
				return <BookOpen className="h-4 w-4 text-blue-600" />;
			case 'returned':
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case 'overdue':
				return <AlertTriangle className="h-4 w-4 text-red-600" />;
			case 'renewed':
				return <Calendar className="h-4 w-4 text-purple-600" />;
			default:
				return null;
		}
	};

	const getStatusText = (status: BorrowStatus) => {
		const texts: Record<BorrowStatus, string> = {
			pending_approval: 'Chờ phê duyệt',
			borrowed: 'Đang mượn',
			returned: 'Đã trả',
			overdue: 'Quá hạn',
			renewed: 'Đã gia hạn',
		};
		return texts[status];
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

	// Function to check if due date is within 3 days
	const isDueWithin3Days = (dueDate: string) => {
		const daysUntilDue = calculateDaysUntilDue(dueDate);
		return daysUntilDue <= 3 && daysUntilDue > 0;
	};

	// Function to handle send notification
	const handleSendNotification = (record: any) => {
		const daysUntilDue = calculateDaysUntilDue(record.due_date);
		const reminderData = {
			daysBeforeDue: record.status === 'overdue' ? 0 : daysUntilDue,
			customMessage:
				record.status === 'overdue'
					? 'Sách đã quá hạn trả, vui lòng trả sách sớm nhất có thể.'
					: `Sách sắp đến hạn trả (còn ${daysUntilDue} ngày), vui lòng trả sách đúng hạn.`,
			readerId: record.reader?.id || '',
		};

		sendReminders(reminderData);
	};

	// Check if a record should have approve button disabled
	const shouldDisableApproveButton = (record: any) => {
		const bookId = record.physicalCopy?.book?.id;
		if (!bookId) return false;

		// Disable if there are pending reservations OR if this book has been approved by someone else
		// But don't disable for the current record being processed
		const isCurrentRecord = record.id === recordToApproveReject?.id;
		return (
			(pendingReservationsByBook[bookId] || approvedBooks[bookId]) &&
			!isCurrentRecord
		);
		// return status === 'available';
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
						<span className="ml-1">{getStatusText(record.status)}</span>
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

						{/* Actions for pending approval */}
						{record.status === 'pending_approval' &&
							record.physicalCopy?.status === 'available' && (
								<>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleApproveRecord(record)}
										title={
											shouldDisableApproveButton(record)
												? approvedBooks[record.physicalCopy?.book?.id]
													? 'Không thể phê duyệt - sách đã được phê duyệt cho người khác'
													: 'Không thể phê duyệt - có đặt trước chờ xử lý'
												: 'Phê duyệt'
										}
										disabled={isApproving || shouldDisableApproveButton(record)}
									>
										<ThumbsUp
											className={`h-4 w-4 ${
												shouldDisableApproveButton(record)
													? 'text-gray-400'
													: 'text-green-600'
											}`}
										/>
									</Button>
									{/* <Button
										variant="ghost"
										size="sm"
										onClick={() => handleRejectRecord(record)}
										title="Từ chối"
										disabled={isRejecting}
									>
										<ThumbsDown className="h-4 w-4 text-red-600" />
									</Button> */}
								</>
							)}

						{/* Actions for borrowed books */}
						{record.status === 'borrowed' && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => openReturnDialog(record)}
									title="Trả sách"
									disabled={isReturning}
								>
									<CheckCircle className="h-4 w-4 text-green-600" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => openRenewDialog(record)}
									title="Gia hạn"
									disabled={isRenewing}
								>
									<Calendar className="h-4 w-4 text-blue-600" />
								</Button>
								{/* Notification button for books due within 3 days */}
								{isDueWithin3Days(record.due_date) && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSendNotification(record)}
										title="Gửi thông báo nhắc nhở"
										className="text-orange-600 hover:text-orange-700"
										disabled={isSendingReminders}
									>
										<Bell className="h-4 w-4" />
									</Button>
								)}
							</>
						)}

						{/* Actions for overdue books */}
						{record.status === 'overdue' && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => openReturnDialog(record)}
									title="Trả sách"
									disabled={isReturning}
								>
									<CheckCircle className="h-4 w-4 text-green-600" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => openRenewDialog(record)}
									title="Gia hạn"
									disabled={isRenewing}
								>
									<Calendar className="h-4 w-4 text-blue-600" />
								</Button>
								{/* Notification button for overdue books */}
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleSendNotification(record)}
									title="Gửi thông báo nhắc nhở (Quá hạn)"
									className="text-red-600 hover:text-red-700"
									disabled={isSendingReminders}
								>
									<Bell className="h-4 w-4" />
								</Button>
							</>
						)}

						{/* đã gia hạn cũng sẽ có nút trả sách */}
						{record.status === 'renewed' && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => openReturnDialog(record)}
									title="Trả sách"
									disabled={isReturning}
								>
									<CheckCircle className="h-4 w-4 text-green-600" />
								</Button>

								{/* {isDueWithin3Days(record.due_date) && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSendNotification(record)}
										title="Gửi thông báo nhắc nhở"
										className="text-orange-600 hover:text-orange-700"
										disabled={isSendingReminders}
									>
										<Bell className="h-4 w-4" />
									</Button>
								)} */}
							</>
						)}

						{/* <Button
							variant="ghost"
							size="sm"
							onClick={() => handleDeleteRecord(record)}
							title="Xóa giao dịch"
							disabled={isDeleting}
							className={cn({
								hidden:
									record.status === 'borrowed',
							})}
						>
							<Trash2 className="h-4 w-4 text-red-600" />
						</Button> */}
					</div>
				</TableCell>
			</TableRow>
		);
	};

	const handleSelectedTab = (value: string) => {
		navigate({
			pathname: '/borrow-records',
			search: createSearchParams({
				status: value,
			}).toString(),
		});
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
			<StatisticsCards stats={stats || null} isLoading={false} />

			{/* Main Content */}
			<Tabs
				value={status}
				onValueChange={handleSelectedTab}
				className="space-y-4"
			>
				<TabsList>
					{/* <TabsTrigger value="all">
						Tất cả Giao dịch
						{meta && (
							<Badge variant="secondary" className="ml-2">
								{meta.totalItems || 0}
							</Badge>
						)}
					</TabsTrigger> */}
					<TabsTrigger value="pending_approval">
						Chờ phê duyệt
						{statusMeta && status === 'pending_approval' && (
							<Badge variant="secondary" className="ml-2">
								{statusMeta.totalItems || 0}
							</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value="borrowed">Đang mượn</TabsTrigger>
					<TabsTrigger value="returned">Đã trả</TabsTrigger>
					<TabsTrigger value="renewed">Đã gia hạn</TabsTrigger>
					<TabsTrigger value="overdue">
						Quá hạn
						{/* {overdueMeta && (
							<Badge variant="secondary" className="ml-2">
								{overdueMeta.totalItems || 0}
							</Badge>
						)} */}
					</TabsTrigger>
				</TabsList>

				{/* Tab Content */}
				<TabsContent value={status} className="space-y-4">
					{isLoading ? (
						<div className="text-center py-8">Đang tải...</div>
					) : statusRecords.length === 0 ? (
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
									{statusRecords.map((record) => renderBorrowRecordRow(record))}
								</TableBody>
							</Table>
						</div>
					)}
				</TabsContent>
			</Tabs>

			{/* Create Borrow Record Dialog */}
			<CreateBorrowRecordDialog
				open={showCreateDialog}
				onOpenChange={setShowCreateDialog}
				onSubmit={handleCreateBorrowRecord}
				isLoading={isCreating}
			/>

			{/* Return Book Dialog */}
			<ReturnBookDialog
				open={showReturnDialog}
				onOpenChange={handleReturnDialogClose}
				bookTitle={recordToReturn?.physicalCopy?.book?.title}
				readerName={recordToReturn?.reader?.fullName}
				onSubmit={handleReturnBook}
				isLoading={isReturning}
			/>

			{/* Renew Book Dialog */}
			<RenewBookDialog
				open={showRenewDialog}
				onOpenChange={handleRenewDialogClose}
				bookTitle={recordToRenew?.physicalCopy?.book?.title}
				readerName={recordToRenew?.reader?.fullName}
				currentDueDate={recordToRenew?.due_date}
				onSubmit={handleRenewBook}
				isLoading={isRenewing}
			/>

			{/* Delete Confirm Dialog */}
			<DeleteConfirmDialog
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				recordTitle={recordToDelete?.physicalCopy?.book?.title}
				readerName={recordToDelete?.reader?.fullName}
			/>

			{/* Approve/Reject Dialog */}
			<ApproveRejectDialog
				open={showApproveRejectDialog}
				onOpenChange={handleApproveRejectDialogClose}
				bookTitle={recordToApproveReject?.physicalCopy?.book?.title}
				readerName={recordToApproveReject?.reader?.fullName}
				action={approveRejectAction}
				onSubmit={handleApproveRejectSubmit}
				isLoading={isApproving || isRejecting}
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
								<strong>Trạng thái:</strong>{' '}
								{getStatusText(selectedRecord.status)}
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
