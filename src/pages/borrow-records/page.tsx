import {
	BorrowRecordsTabs,
	PageHeader,
	RecordDetailsDialog,
} from './components';
import type { CreateFineRequest, FineType } from '@/types/fines';
import {
	createSearchParams,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApproveRejectDialog } from './components/approve-reject-dialog';
import { BorrowRecordsAPI } from '@/apis/borrow-records';
import type { BorrowStatus } from '@/types/borrow-records';
import { CreateBorrowRecordDialog } from './components/create-borrow-record-dialog';
import { DeleteConfirmDialog } from './components/delete-confirm-dialog';
import { RenewBookDialog } from './components/renew-book-dialog';
import { ReservationsAPI } from '@/apis/reservations';
import { ReturnBookDialog } from './components/return-book-dialog';
import { StatisticsCards } from './components/statistics-cards';
import { toast } from 'sonner';
import { useCreateFine } from '@/hooks/fines/use-create-fine';
import { useState } from 'react';
import { useUpdatePhysicalCopyStatus } from '@/hooks/physical-copies';

export default function BorrowRecordsPage() {
	const navigate = useNavigate();

	const [params] = useSearchParams();
	const status = params.get('status') || 'borrowed';
	// const status = params.get('status') || 'pending_approval';
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
	``;
	// Hook cho filter theo status
	const {
		borrowRecords: statusRecords,
		meta: statusMeta,
		isLoading: isLoadingStatus,
	} = useBorrowRecordsByStatus({
		params: borrowRecordStatus,
		enabled: true, // Luôn enable để phản ứng với thay đổi params
	});
	console.log('🚀 ~ BorrowRecordsPage ~ statusRecords:', statusRecords);

	// Mutation hooks
	const { createBorrowRecord, isCreating } = useCreateBorrowRecord();
	const { returnBook, isReturning } = useReturnBook();
	const { renewBook, isRenewing } = useRenewBook();
	const { deleteBorrowRecord, isDeleting } = useDeleteBorrowRecord();
	const { approveBorrowRecord, isApproving } = useApproveBorrowRecord();
	const { rejectBorrowRecord, isRejecting } = useRejectBorrowRecord();

	// Hook để cập nhật trạng thái quá hạn
	const updateOverdueMutation = useMutation({
		mutationFn: async (record: any) => {
			return await BorrowRecordsAPI.update(record.id, {
				status: 'overdue',
				return_notes: `Cập nhật trạng thái quá hạn - ${new Date().toLocaleDateString(
					'vi-VN'
				)}`,
			});
		},
		onSuccess: (updatedRecord) => {
			toast.success('Đã cập nhật trạng thái thành quá hạn!');

			// Invalidate queries để refresh data
			queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
			queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
			queryClient.invalidateQueries({
				queryKey: ['borrow-records-by-status', borrowRecordStatus],
			});
		},
		onError: (error: Error) => {
			toast.error('Có lỗi xảy ra khi cập nhật trạng thái quá hạn!');
			console.error('Error updating overdue status:', error);
		},
	});

	// Hook để tạo phiếu phạt
	const { createFine, isCreating: isCreatingFine } = useCreateFine();

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

	// Function to handle update overdue status
	const handleUpdateOverdue = (record: any) => {
		updateOverdueMutation.mutate(record);
	};

	// Function to handle create fine
	const handleCreateFine = (record: any) => {
		// Tính toán số ngày quá hạn
		const calculateDaysOverdue = (dueDate: string) => {
			const due = new Date(dueDate);
			const today = new Date();
			const diffTime = today.getTime() - due.getTime();
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			return diffDays > 0 ? diffDays : 0;
		};

		const daysOverdue = calculateDaysOverdue(record.due_date);
		const dailyRate = 10000; // 10,000 VND mỗi ngày
		const fineAmount = daysOverdue * dailyRate;

		const fineData: CreateFineRequest = {
			borrow_id: record.id,
			fine_amount: fineAmount,
			fine_date: new Date().toISOString(),
			reason: 'overdue' as FineType,
			description: `Phạt trả sách muộn ${daysOverdue} ngày`,
			overdue_days: daysOverdue,
			daily_rate: dailyRate,
			librarian_notes: `Tạo phiếu phạt tự động cho sách "${record.physicalCopy?.book?.title}"`,
		};

		createFine(fineData, {
			onSuccess: () => {
				// Invalidate queries để refresh data
				queryClient.invalidateQueries({ queryKey: ['fines'] });
				queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
				queryClient.invalidateQueries({ queryKey: ['borrow-records-stats'] });
			},
		});
	};

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

	// Function to handle send notification
	const handleSendNotification = (record: any) => {
		const calculateDaysUntilDue = (dueDate: string) => {
			const due = new Date(dueDate);
			const today = new Date();
			const diffTime = due.getTime() - today.getTime();
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			return diffDays > 0 ? diffDays : 0;
		};

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
			<PageHeader onCreateClick={() => setShowCreateDialog(true)} />

			{/* Statistics Cards */}
			<StatisticsCards stats={stats || null} isLoading={false} />

			{/* Main Content */}
			<BorrowRecordsTabs
				status={status}
				onTabChange={handleSelectedTab}
				records={statusRecords}
				isLoading={isLoadingStatus}
				onViewDetails={setSelectedRecord}
				onApprove={handleApproveRecord}
				onReturn={openReturnDialog}
				onRenew={openRenewDialog}
				onSendNotification={handleSendNotification}
				onDelete={handleDeleteRecord}
				onUpdateOverdue={handleUpdateOverdue}
				onCreateFine={handleCreateFine}
				isApproving={isApproving}
				isReturning={isReturning}
				isRenewing={isRenewing}
				isSendingReminders={isSendingReminders}
				isDeleting={isDeleting}
				isUpdatingOverdue={updateOverdueMutation.isPending}
				isCreatingFine={isCreatingFine}
				shouldDisableApproveButton={shouldDisableApproveButton}
				approvedBooks={approvedBooks}
			/>

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

			{/* Record Details Dialog */}
			{selectedRecord && (
				<RecordDetailsDialog
					record={selectedRecord}
					onClose={() => setSelectedRecord(null)}
				/>
			)}
		</div>
	);
}
