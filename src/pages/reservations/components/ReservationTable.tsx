import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { Reservation, ReservationStatus } from '@/types/reservations';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ReservationTableProps {
	reservations: Reservation[];
	isLoading: boolean;
	onFulfill: (id: string) => void;
	onCancel: (data: {
		id: string;
		librarianId: string;
		reason?: string;
	}) => void;
	onDelete: (reservation: Reservation) => void;
	onViewDetails?: (reservation: Reservation) => void;
	onExpire: (reservationId: string) => void;
	isFulfillPending: boolean;
	isCancelPending: boolean;
	isDeletePending: boolean;
	isBlockedByExpiredReservations?: boolean;
}

export const ReservationTable: React.FC<ReservationTableProps> = ({
	reservations,
	isLoading,
	onFulfill,
	onCancel,
	onDelete,
	onViewDetails,
	onExpire,
	isFulfillPending,
	isCancelPending,
	isDeletePending,
	isBlockedByExpiredReservations = false,
}) => {
	const getStatusColor = (status: ReservationStatus) => {
		const colors: Record<ReservationStatus, string> = {
			pending: 'bg-yellow-100 text-yellow-800',
			fulfilled: 'bg-green-100 text-green-800',
			cancelled: 'bg-red-100 text-red-800',
			expired: 'bg-gray-100 text-gray-800',
		};
		return colors[status];
	};

	const getStatusIcon = (status: ReservationStatus) => {
		switch (status) {
			case 'pending':
				return <Clock className="h-4 w-4 text-yellow-600" />;
			case 'fulfilled':
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case 'cancelled':
				return <XCircle className="h-4 w-4 text-red-600" />;
			case 'expired':
				return <Calendar className="h-4 w-4 text-gray-600" />;
			default:
				return null;
		}
	};

	const getStatusText = (status: ReservationStatus) => {
		switch (status) {
			case 'pending':
				return 'Đang chờ';
			case 'fulfilled':
				return 'Đã thực hiện';
			case 'cancelled':
				return 'Đã hủy';
			case 'expired':
				return 'Hết hạn';
			default:
				return status;
		}
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('vi-VN');
	};

	const calculateDaysUntilExpiry = (expiryDate: string) => {
		const expiry = new Date(expiryDate);
		// const today = new Date();
		const today = new Date(new Date().setDate(new Date().getDate() + 2)); // fake today
		const diffTime = expiry.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	};

	const isExpiringSoon = (expiryDate: string) => {
		// Cảnh báo khi còn 1 ngày hoặc ít hơn (phù hợp với thời gian hết hạn 2 ngày)
		return calculateDaysUntilExpiry(expiryDate) <= 1;
	};

	if (isLoading) {
		return <div className="text-center py-8">Đang tải...</div>;
	}

	if (reservations.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				Không có đặt trước nào
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Sách</TableHead>
					<TableHead>Độc giả</TableHead>
					<TableHead>Ngày đặt</TableHead>
					<TableHead>Hạn hết</TableHead>
					<TableHead>Trạng thái</TableHead>
					<TableHead>Ghi chú</TableHead>
					<TableHead className="text-right">Thao tác</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{reservations.map((reservation: Reservation) => (
					<TableRow key={reservation.id}>
						<TableCell className="font-medium">
							<div className="flex items-center gap-2">
								<img
									src={reservation.book?.cover_image}
									alt={reservation.book?.title}
									className="w-10 h-14 object-cover rounded-md"
								/>
								{reservation.book?.title || 'Không có tên sách'}
							</div>
						</TableCell>
						<TableCell>
							{reservation.reader?.fullName || 'Không có tên độc giả'}
						</TableCell>
						<TableCell>{formatDate(reservation.reservation_date)}</TableCell>
						<TableCell>
							<div className="flex flex-col">
								<span
									className={
										isExpiringSoon(reservation.expiry_date)
											? 'text-yellow-600 font-semibold'
											: ''
									}
								>
									{formatDate(reservation.expiry_date)}
								</span>
								{reservation.status === 'pending' &&
									isExpiringSoon(reservation.expiry_date) && (
										<span className="text-xs text-yellow-600">
											Còn {calculateDaysUntilExpiry(reservation.expiry_date)}{' '}
											ngày
										</span>
									)}
							</div>
						</TableCell>
						<TableCell>
							<Badge className={getStatusColor(reservation.status)}>
								{getStatusIcon(reservation.status)}
								<span className="ml-1">
									{getStatusText(reservation.status)}
								</span>
							</Badge>
						</TableCell>
						<TableCell>
							<div className="max-w-[200px] truncate">
								{reservation.reader_notes || '-'}
							</div>
						</TableCell>
						<TableCell className="text-right">
							<div className="flex gap-2 justify-end">
								{/* Hiển thị button dựa trên status */}
								{reservation.status === 'pending' && (
									<>
										{/* Kiểm tra xem đặt trước có quá hạn không */}
										{new Date(reservation.expiry_date) < new Date() ? (
											// Đặt trước quá hạn - chỉ hiển thị button Hủy
											<Button
												variant="destructive"
												size="sm"
												onClick={() => onExpire(reservation.id)}
												disabled={isCancelPending}
											>
												Hủy (Quá hạn)
											</Button>
										) : (
											// Đặt trước còn hạn - hiển thị đầy đủ button
											<>
												<Button
													size="sm"
													onClick={() => onFulfill(reservation.id)}
													disabled={
														isFulfillPending || isBlockedByExpiredReservations
													}
													title={
														isBlockedByExpiredReservations
															? 'Bạn phải hủy hết đặt trước quá hạn trước'
															: ''
													}
												>
													Thực hiện
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														onCancel({
															id: reservation.id,
															librarianId: '', // Sẽ được override bởi parent component
															reason: 'Hủy bởi thủ thư',
														})
													}
													disabled={isCancelPending}
												>
													Hủy
												</Button>
											</>
										)}
									</>
								)}

								{/* Hiển thị button "Xem chi tiết" cho status fulfilled */}
								{reservation.status === 'fulfilled' && onViewDetails && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => onViewDetails(reservation)}
									>
										Xem chi tiết
									</Button>
								)}

								{/* Hiển thị thông báo "Đã hoàn thành" nếu không có onViewDetails */}
								{reservation.status === 'fulfilled' && !onViewDetails && (
									<span className="text-sm text-green-600 font-medium">
										✓ Đã hoàn thành
									</span>
								)}

								{/* Button xóa luôn hiển thị (trừ khi status là fulfilled) */}
								{/* {reservation.status !== 'fulfilled' && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => onDelete(reservation)}
										disabled={isDeletePending}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								)} */}

								{/* Hiển thị thông báo cho các status khác */}
								{reservation.status === 'cancelled' && (
									<span className="text-sm text-red-600 font-medium">
										Đã hủy
									</span>
								)}
								{reservation.status === 'expired' && (
									<span className="text-sm text-gray-600 font-medium">
										Hết hạn
									</span>
								)}
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
