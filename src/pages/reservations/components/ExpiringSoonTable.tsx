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
import { Clock } from 'lucide-react';
import type { ReservationExpiringSoonItem } from '@/types/reservations';

interface ExpiringSoonTableProps {
	reservations: ReservationExpiringSoonItem[];
	onFulfill: (id: string) => void;
	onCancel: (data: {
		id: string;
		librarianId: string;
		reason?: string;
	}) => void;
	onViewDetails?: (reservation: ReservationExpiringSoonItem) => void;
	isFulfillPending: boolean;
	isCancelPending: boolean;
	isBlockedByExpiredReservations?: boolean;
}

export const ExpiringSoonTable: React.FC<ExpiringSoonTableProps> = ({
	reservations,
	onFulfill,
	onCancel,
	onViewDetails,
	isFulfillPending,
	isCancelPending,
	isBlockedByExpiredReservations = false,
}) => {
	const formatDate = (dateString: string) => {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('vi-VN');
	};

	const calculateDaysUntilExpiry = (expiryDate: string) => {
		const expiry = new Date(expiryDate);
		const today = new Date();
		const diffTime = expiry.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	};

	if (reservations.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				Không có đặt trước nào sắp hết hạn
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
					<TableHead>Còn lại</TableHead>
					<TableHead>Ghi chú</TableHead>
					<TableHead className="text-right">Thao tác</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{reservations.map((reservation: ReservationExpiringSoonItem) => (
					<TableRow key={reservation.id}>
						<TableCell className="font-medium">
							{reservation.book?.title || 'Không có tên sách'}
						</TableCell>
						<TableCell>
							{reservation.reader?.fullName || 'Không có tên độc giả'}
						</TableCell>
						<TableCell>{formatDate(reservation.reservation_date)}</TableCell>
						<TableCell>
							<span className="text-yellow-600 font-semibold">
								{formatDate(reservation.expiry_date)}
							</span>
						</TableCell>
						<TableCell>
							<Badge className="bg-yellow-100 text-yellow-800">
								<Clock className="mr-1 h-3 w-3" />
								{calculateDaysUntilExpiry(reservation.expiry_date)} ngày
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

								{/* Hiển thị thông báo cho status pending nếu không có button */}
								{reservation.status === 'pending' && (
									<span className="text-sm text-yellow-600 font-medium">
										⏳ Đang chờ
									</span>
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

								{/* Không hiển thị button nào cho status fulfilled */}
								{reservation.status === 'fulfilled' && !onViewDetails && (
									<span className="text-sm text-green-600 font-medium">
										✓ Đã hoàn thành
									</span>
								)}

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
