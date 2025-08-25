import { Card, CardContent } from '@/components/ui/card';
import {
	CreateReservationDialog,
	DeleteReservationDialog,
	ReservationDetailsDialog,
	ReservationStats,
	ReservationTabs,
} from './components';
import type {
	Reservation,
	ReservationExpiringSoonItem,
} from '@/types/reservations';
import {
	useApproveBorrowRecord,
	useBorrowRecordsByStatus,
} from '@/hooks/borrow-records';
import {
	useCancelReservation,
	useCreateReservation,
	useDeleteReservation,
	useFulfillReservation,
	useReservationStats,
	useReservationStatsByStatus,
	useReservations,
	useReservationsExpiringSoon,
} from '@/hooks/reservations';
import { useEffect, useState } from 'react';

import { BorrowRecordsAPI } from '@/apis/borrow-records';
import { NotificationsAPI } from '@/apis';
import { PhysicalCopiesAPI } from '@/apis/physical-copies';
import { ReservationsAPI } from '@/apis/reservations';
import { toast } from 'sonner';
import { useExpireReservation } from '@/hooks/reservations/use-exprice-revations';
import { useGetProfile } from '@/hooks/users/use-get-profile';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryParams } from '@/hooks/useQueryParam';

export default function ReservationsPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [activeTab, setActiveTab] = useState('all');
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [reservationToDelete, setReservationToDelete] =
		useState<Reservation | null>(null);
	const [showDetailsDialog, setShowDetailsDialog] = useState(false);
	const [selectedReservationId, setSelectedReservationId] = useState<
		string | null
	>(null);

	const { data: user } = useGetProfile();
	const queryParams = useQueryParams();
	const currentStatus = queryParams.status || 'all';

	const queryClient = useQueryClient();
	const { approveBorrowRecord, isApproving } = useApproveBorrowRecord();

	// Fetch reservations data
	const { reservations, isLoading: isLoadingReservations } = useReservations({
		page: 1,
		limit: 20,
		searchQuery: searchQuery || undefined,
	});
	console.log('🚀 ~ ReservationsPage ~ reservations:', reservations);

	// Hook cho filter theo status
	const {
		borrowRecords: statusRecords,
		meta: statusMeta,
		isLoading: isLoadingStatus,
	} = useBorrowRecordsByStatus({
		params: {
			status: 'pending_approval',
			page: 1,
			limit: 1000,
		},
		enabled: true, // Luôn enable để phản ứng với thay đổi params
	});

	// Fetch expiring soon reservations (1 ngày tới)
	const { reservations: expiringSoonReservations } =
		useReservationsExpiringSoon({
			days: 1,
			enabled: activeTab === 'expiring',
		});

	// Fetch statistics
	const { stats } = useReservationStats();
	const { stats: statusStats } = useReservationStatsByStatus();

	// Mutations
	const createReservationMutation = useCreateReservation();
	const fulfillReservationMutation = useFulfillReservation();
	const cancelReservationMutation = useCancelReservation();
	const deleteReservationMutation = useDeleteReservation();
	const expireReservationMutation = useExpireReservation();

	// Logic kiểm tra đặt trước quá hạn - chỉ check khi ở tab "all" hoặc "pending"
	const hasExpiredReservations =
		(currentStatus === 'all' || currentStatus === 'pending') &&
		((statusStats?.expired || 0) > 0 ||
			reservations.some(
				(reservation) =>
					reservation.status === 'pending' &&
					new Date(reservation.expiry_date) < new Date()
			));

	// Logic chặn thao tác khi còn đặt trước quá hạn
	const isBlockedByExpiredReservations = hasExpiredReservations;

	// Thông báo cảnh báo khi có đặt trước quá hạn
	useEffect(() => {
		if (hasExpiredReservations) {
			toast.warning('🚨 CÓ ĐẶT TRƯỚC QUÁ HẠN!', {
				description:
					'Bạn phải hủy hết tất cả đặt trước quá hạn trước khi có thể thao tác với các đặt trước còn hạn.',
				duration: Infinity,
			});
		}
	}, [hasExpiredReservations]);

	// Tự động chuyển tab khi có đặt trước quá hạn
	useEffect(() => {
		if (hasExpiredReservations && activeTab !== 'expired') {
			setActiveTab('expired');
		}
	}, [hasExpiredReservations, activeTab]);

	const handleSearch = (value: string) => {
		setSearchQuery(value);
	};

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);
	};

	const handleExpireReservation = (reservationId: string) => {
		// Hiển thị thông báo bắt đầu xử lý
		const mainLoadingToast = toast.loading(
			'Đang đánh dấu đặt trước hết hạn...'
		);

		expireReservationMutation.mutate(
			{
				id: reservationId,
				librarianId: user?.id || '',
				reason: `Đánh dấu hết hạn bởi thủ thư ${user?.username}`,
			},
			{
				onSuccess: async (response) => {
					toast.success('Đánh dấu đặt trước hết hạn thành công!');

					// Tìm reservation đã bị expire để lấy thông tin
					const expiredReservation = reservations.find(
						(r) => r.id === reservationId
					);
					if (!expiredReservation) {
						console.error('Không tìm thấy reservation đã expire');
						toast.dismiss(mainLoadingToast);
						return;
					}

					try {
						// 1. Tìm borrow record tương ứng với reservation này
						const relatedBorrowRecord = statusRecords.find((record) => {
							return (
								expiredReservation.reader_id === record.reader_id &&
								expiredReservation.book_id === record.physicalCopy?.book_id &&
								expiredReservation.physical_copy_id === record.physicalCopy?.id
							);
						});

						if (relatedBorrowRecord) {
							// 2. Update borrow record status thành 'cancelled'
							await BorrowRecordsAPI.update(relatedBorrowRecord.id, {
								status: 'cancelled',
								return_notes: `Đặt trước đã hết hạn - ${user?.username}`,
							});

							// 3. Update physical copy status thành 'available' nếu có
							if (expiredReservation.physical_copy_id) {
								await PhysicalCopiesAPI.updateStatus(
									expiredReservation.physical_copy_id,
									{
										status: 'available',
										notes: `Đặt trước đã hết hạn - Trả về trạng thái sẵn sàng`,
									}
								);
							}

							// 4. Gửi thông báo cho độc giả về việc đặt trước đã hết hạn
							try {
								NotificationsAPI.sendReminders({
									readerId: expiredReservation.reader_id,
									customMessage: `Xin chào! Đặt trước sách "${expiredReservation.book?.title}" của bạn đã hết hạn. Sách sẽ được trả về kho và có thể được đặt trước lại nếu cần thiết.`,
								});
							} catch (error) {
								console.error('Lỗi gửi thông báo:', error);
								toast.warning(
									'Đã đánh dấu hết hạn nhưng không thể gửi thông báo đến độc giả.'
								);
							}
						}

						// 5. Invalidate queries để refresh data
						queryClient.invalidateQueries({ queryKey: ['reservations'] });
						queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
						queryClient.invalidateQueries({ queryKey: ['physical-copies'] });
						queryClient.invalidateQueries({
							queryKey: [
								'borrow-records-by-status',
								{
									status: 'pending_approval',
									page: 1,
									limit: 1000,
								},
							],
						});

						// Dismiss main loading toast
						toast.dismiss(mainLoadingToast);

						// Hiển thị thông báo thành công với thông tin chi tiết
						toast.success(`Đã đánh dấu hết hạn đặt trước thành công!`, {
							duration: 5000,
							description: (
								<div className="mt-2 space-y-1 text-sm">
									<div>
										<strong>Độc giả:</strong>{' '}
										{expiredReservation.reader?.fullName || 'N/A'}
									</div>
									<div>
										<strong>Sách:</strong>{' '}
										{expiredReservation.book?.title || 'N/A'}
									</div>
									<div className="text-green-600">
										✓ Đã cập nhật trạng thái borrow record
									</div>
									<div className="text-green-600">
										✓ Đã cập nhật trạng thái physical copy
									</div>
									<div className="text-green-600">
										✓ Đã gửi thông báo đến độc giả
									</div>
								</div>
							),
						});
					} catch (error) {
						console.error('Lỗi khi cập nhật trạng thái:', error);
						toast.dismiss(mainLoadingToast);
						toast.error(
							'Đã đánh dấu hết hạn nhưng có lỗi khi cập nhật trạng thái!'
						);
					}
				},
				onError: (error) => {
					console.error('Lỗi khi đánh dấu hết hạn đặt trước:', error);
					toast.dismiss(mainLoadingToast);
					toast.error('Có lỗi xảy ra khi đánh dấu hết hạn đặt trước!');
				},
			}
		);
	};

	const handleCreateReservation = (data: any) => {
		// Chặn tạo đặt trước khi còn đặt trước quá hạn
		if (isBlockedByExpiredReservations) {
			toast.error('Không thể tạo đặt trước mới!', {
				description: 'Bạn phải hủy hết tất cả đặt trước quá hạn trước.',
			});
			return;
		}

		createReservationMutation.mutate(data, {
			onSuccess: () => {
				setShowCreateDialog(false);
				toast.success('Tạo đặt trước thành công!');
			},
		});
	};

	const handleFulfillReservation = async (reservationId: string) => {
		// Chặn thực hiện đặt trước khi còn đặt trước quá hạn
		if (isBlockedByExpiredReservations) {
			toast.error('Không thể thực hiện đặt trước!', {
				description: 'Bạn phải hủy hết tất cả đặt trước quá hạn trước.',
			});
			return;
		}

		// Hiển thị thông báo bắt đầu xử lý
		const mainLoadingToast = toast.loading('Bắt đầu xử lý đặt trước...');

		const reservation = reservations.find(
			(reservation) => reservation.id === reservationId
		);
		if (reservation) {
			// find borrow record by reservation id
			const borrowRecord = statusRecords.find((record) => {
				return (
					reservation.reader_id === record.reader_id &&
					reservation.book_id === record.physicalCopy?.book_id &&
					reservation.physical_copy_id === record.physicalCopy?.id
				);
			});

			if (borrowRecord) {
				// Approve the borrow record to change status from pending_approval to borrowed
				approveBorrowRecord(
					{
						id: borrowRecord.id,
						data: {
							librarianId: user?.id || '',
							notes: `Đặt trước được thực hiện - Reservation ID: ${reservation.id} - ${user?.id}`,
						},
					},
					{
						onSuccess: async () => {
							// Fulfill the reservation after approving borrow record
							try {
								await ReservationsAPI.fulfill(reservationId, {
									librarianId: user?.id || '',
									notes: `Đặt trước được thực hiện - Reservation ID: ${reservation.id} - ${user?.id}`,
								});

								// Gửi thông báo nhắc nhở cho độc giả
								const dueDate = new Date();
								dueDate.setDate(dueDate.getDate() + 14); // Mặc định 14 ngày

								// Hiển thị thông báo đang gửi
								const loadingToast = toast.loading(
									'Đang gửi thông báo đến độc giả...'
								);

								// Gửi thông báo cho độc giả cụ thể
								try {
									NotificationsAPI.sendReminders({
										readerId: reservation.reader_id,
										customMessage: `Xin chào! Đặt trước sách của bạn đã được thực hiện thành công. Sách sẽ được giao trong thời gian sớm nhất. Ngày trả dự kiến: ${dueDate.toLocaleDateString(
											'vi-VN'
										)}. Vui lòng kiểm tra email hoặc liên hệ thư viện để nhận sách.`,
									});

									// Dismiss loading toast
									toast.dismiss(loadingToast);
								} catch (error) {
									console.error('Lỗi gửi thông báo:', error);
									toast.dismiss(loadingToast);
									toast.warning(
										'Đặt trước thành công nhưng không thể gửi thông báo đến độc giả. Vui lòng thử lại sau.'
									);
								}

								// Hiển thị thông báo thành công với thông tin chi tiết
								toast.success(`Đã thực hiện đặt trước thành công!`, {
									duration: 5000,
									description: (
										<div className="mt-2 space-y-1 text-sm">
											<div>
												<strong>Độc giả:</strong>{' '}
												{reservation.reader?.fullName || 'N/A'}
											</div>
											<div>
												<strong>Sách:</strong>{' '}
												{reservation.book?.title || 'N/A'}
											</div>
											<div>
												<strong>Ngày trả dự kiến:</strong>{' '}
												{dueDate.toLocaleDateString('vi-VN')}
											</div>
											<div className="text-green-600">
												✓ Thông báo đã được gửi đến độc giả
											</div>
										</div>
									),
								});

								// Dismiss main loading toast
								toast.dismiss(mainLoadingToast);

								// Invalidate queries để refresh data
								queryClient.invalidateQueries({ queryKey: ['reservations'] });
								queryClient.invalidateQueries({
									queryKey: ['reservation-stats'],
								});
								queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
								queryClient.invalidateQueries({
									queryKey: ['borrow-records-stats'],
								});
								queryClient.invalidateQueries({
									queryKey: [
										'borrow-records-by-status',
										{
											status: 'pending_approval',
											page: 1,
											limit: 1000,
										},
									],
								});
							} catch (error) {
								console.error('Lỗi thực hiện đặt trước:', error);
								toast.dismiss(mainLoadingToast);
								toast.error('Có lỗi xảy ra khi thực hiện đặt trước!', {
									description:
										'Vui lòng thử lại hoặc liên hệ quản trị viên nếu vấn đề vẫn tiếp tục.',
								});
							}
						},
						onError: (error: Error) => {
							console.error('Lỗi phê duyệt yêu cầu mượn sách:', error);
							toast.dismiss(mainLoadingToast);
							toast.error('Có lỗi xảy ra khi phê duyệt yêu cầu mượn sách!', {
								description:
									'Vui lòng thử lại hoặc liên hệ quản trị viên nếu vấn đề vẫn tiếp tục.',
							});
						},
					}
				);
			} else {
				toast.dismiss(mainLoadingToast);
				toast.error('Không tìm thấy yêu cầu mượn sách tương ứng!', {
					description:
						'Vui lòng kiểm tra lại thông tin đặt trước hoặc liên hệ quản trị viên.',
				});
			}
		} else {
			toast.dismiss(mainLoadingToast);
			toast.error('Không tìm thấy thông tin đặt trước!', {
				description:
					'Vui lòng kiểm tra lại ID đặt trước hoặc liên hệ quản trị viên.',
			});
		}
	};

	const handleCancelReservationExpiring = (data: {
		id: string;
		librarianId: string;
		reason?: string;
	}) => {
		// Cho phép hủy đặt trước quá hạn (không chặn)
		// Chỉ chặn các thao tác khác khi còn đặt trước quá hạn

		cancelReservationMutation.mutate(
			{
				id: data.id,
				librarianId: user?.id || '',
				reason: data.reason || 'Hủy bởi thủ thư',
			},
			{
				onSuccess: async (response) => {
					toast.success('Đã hủy đặt trước thành công!');

					// Tìm reservation đã bị hủy để lấy thông tin
					const cancelledReservation = reservations.find(
						(r) => r.id === data.id
					);
					if (!cancelledReservation) {
						console.error('Không tìm thấy reservation đã hủy');
						return;
					}

					try {
						// 1. Tìm borrow record tương ứng với reservation này
						const relatedBorrowRecord = statusRecords.find((record) => {
							return (
								cancelledReservation.reader_id === record.reader_id &&
								cancelledReservation.book_id === record.physicalCopy?.book_id &&
								cancelledReservation.physical_copy_id ===
									record.physicalCopy?.id
							);
						});

						if (relatedBorrowRecord) {
							// 2. Update borrow record status thành 'cancelled'
							await BorrowRecordsAPI.update(relatedBorrowRecord.id, {
								status: 'cancelled',
								return_notes: `Đặt trước đã bị hủy - ${
									data.reason || 'Hủy bởi thủ thư'
								}`,
							});

							// 3. Update physical copy status thành 'available' nếu có
							if (cancelledReservation.physical_copy_id) {
								await PhysicalCopiesAPI.updateStatus(
									cancelledReservation.physical_copy_id,
									{
										status: 'available',
										notes: `Đặt trước đã bị hủy - Trả về trạng thái sẵn sàng`,
									}
								);
							}
						}

						// 4. Invalidate queries để refresh data
						queryClient.invalidateQueries({ queryKey: ['reservations'] });
						queryClient.invalidateQueries({ queryKey: ['borrow-records'] });
						queryClient.invalidateQueries({ queryKey: ['physical-copies'] });
					} catch (error) {
						console.error('Lỗi khi cập nhật trạng thái:', error);
						toast.error(
							'Đã hủy đặt trước nhưng có lỗi khi cập nhật trạng thái!'
						);
					}
				},
				onError: (error) => {
					console.error('Lỗi khi hủy đặt trước:', error);
					toast.error('Có lỗi xảy ra khi hủy đặt trước!');
				},
			}
		);
	};

	const handleViewDetails = (reservation: Reservation) => {
		// Chặn xem chi tiết khi còn đặt trước quá hạn
		if (isBlockedByExpiredReservations) {
			toast.error('Không thể xem chi tiết!', {
				description: 'Bạn phải hủy hết tất cả đặt trước quá hạn trước.',
			});
			return;
		}

		setSelectedReservationId(reservation.id);
		setShowDetailsDialog(true);
		console.log('Xem chi tiết reservation:', reservation);
	};

	const handleViewDetailsExpiring = (
		reservation: ReservationExpiringSoonItem
	) => {
		// Chặn xem chi tiết khi còn đặt trước quá hạn
		if (isBlockedByExpiredReservations) {
			toast.error('Không thể xem chi tiết!', {
				description: 'Bạn phải hủy hết tất cả đặt trước quá hạn trước.',
			});
			return;
		}

		setSelectedReservationId(reservation.id);
		setShowDetailsDialog(true);
		console.log('Xem chi tiết expiring reservation:', reservation);
	};

	const handleDeleteReservation = (reservation: Reservation) => {
		// Chặn xóa đặt trước khi còn đặt trước quá hạn
		if (isBlockedByExpiredReservations) {
			toast.error('Không thể xóa đặt trước!', {
				description: 'Bạn phải hủy hết tất cả đặt trước quá hạn trước.',
			});
			return;
		}

		setReservationToDelete(reservation);
		setShowDeleteDialog(true);
	};

	const confirmDeleteReservation = () => {
		if (!reservationToDelete) return;

		deleteReservationMutation.mutate(reservationToDelete.id, {
			onSuccess: () => {
				setShowDeleteDialog(false);
				setReservationToDelete(null);
				toast.success('Đã xóa đặt trước thành công!');
			},
			onError: () => {
				toast.error('Có lỗi xảy ra khi xóa đặt trước!');
			},
		});
	};

	// Logic filter đã được xử lý trong component ReservationTabs

	// Tự động chuyển tab khi có đặt trước quá hạn
	useEffect(() => {
		if (hasExpiredReservations && activeTab !== 'expired') {
			setActiveTab('expired');
		}
	}, [hasExpiredReservations, activeTab]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Quản lý Đặt Trước</h1>
					<p className="text-muted-foreground">
						Theo dõi và quản lý các yêu cầu đặt trước sách trong thư viện
					</p>
				</div>
				{/* <Button onClick={() => setShowCreateDialog(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Tạo Đặt Trước
				</Button> */}
			</div>

			{/* Statistics Cards */}
			<ReservationStats stats={stats} />

			{/* Warning Banner khi có đặt trước quá hạn */}
			{hasExpiredReservations && (
				<Card className="border-red-200 bg-red-50 ">
					<CardContent className="">
						<div className="flex items-center space-x-3">
							<div className="flex-shrink-0">
								<svg
									className="h-6 w-6 text-red-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-red-800">
									⚠️ Có đặt trước quá hạn!
								</h3>
								<p className="text-red-700">
									Bạn phải hủy hết tất cả đặt trước quá hạn trước khi có thể
									thao tác với các đặt trước còn hạn.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Main Content */}
			<ReservationTabs
				activeTab={activeTab}
				onTabChange={setActiveTab}
				searchQuery={searchQuery}
				selectedStatus={selectedStatus}
				onSearchChange={handleSearch}
				onStatusChange={handleStatusFilter}
				reservations={reservations}
				expiringSoonReservations={expiringSoonReservations}
				isLoadingReservations={isLoadingReservations}
				isFulfillPending={fulfillReservationMutation.isPending}
				isCancelPending={cancelReservationMutation.isPending}
				isDeletePending={deleteReservationMutation.isPending}
				isApproving={isApproving}
				onFulfill={handleFulfillReservation}
				onCancel={handleCancelReservationExpiring}
				onDelete={handleDeleteReservation}
				onViewDetails={handleViewDetails}
				onViewDetailsExpiring={handleViewDetailsExpiring}
				onExpire={handleExpireReservation}
				isBlockedByExpiredReservations={isBlockedByExpiredReservations}
			/>

			{/* Create Reservation Dialog */}
			<CreateReservationDialog
				open={showCreateDialog}
				onOpenChange={setShowCreateDialog}
				onSubmit={handleCreateReservation}
				isLoading={createReservationMutation.isPending}
			/>

			{/* Delete Reservation Dialog */}
			<DeleteReservationDialog
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				reservation={reservationToDelete}
				onConfirm={confirmDeleteReservation}
				isLoading={deleteReservationMutation.isPending}
			/>

			{/* Reservation Details Dialog */}
			<ReservationDetailsDialog
				open={showDetailsDialog}
				onOpenChange={setShowDetailsDialog}
				reservationId={selectedReservationId}
			/>
		</div>
	);
}
