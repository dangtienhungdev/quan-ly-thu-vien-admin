import {
	Book,
	Calendar,
	CheckCircle,
	Clock,
	MapPin,
	User,
	XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useGetUserById } from '@/hooks/users/use-get-user-by-id';
import { useReservationById } from '@/hooks/reservations';
import { vi } from 'date-fns/locale';

interface ReservationDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	reservationId: string | null;
}

export const ReservationDetailsDialog: React.FC<
	ReservationDetailsDialogProps
> = ({ open, onOpenChange, reservationId }) => {
	const { reservation, isLoading, error } = useReservationById({
		id: reservationId || '',
		enabled: open && !!reservationId,
	});

	// lấy ra thông tin người dùng
	const { data: user } = useGetUserById(reservation?.fulfilled_by || '');

	const getStatusColor = (status: string) => {
		const colors: Record<string, string> = {
			pending: 'bg-yellow-100 text-yellow-800',
			fulfilled: 'bg-green-100 text-green-800',
			cancelled: 'bg-red-100 text-red-800',
			expired: 'bg-gray-100 text-gray-800',
		};
		return colors[status] || 'bg-gray-100 text-gray-800';
	};

	const getStatusIcon = (status: string) => {
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

	const getStatusText = (status: string) => {
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
		try {
			return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
		} catch {
			return dateString;
		}
	};

	if (isLoading) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-4xl">
					<DialogHeader>
						<DialogTitle>Đang tải thông tin...</DialogTitle>
					</DialogHeader>
					<div className="flex items-center justify-center py-8">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
							<p className="mt-2 text-muted-foreground">
								Đang tải thông tin đặt trước...
							</p>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (error || !reservation) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-4xl">
					<DialogHeader>
						<DialogTitle>Lỗi</DialogTitle>
						<DialogDescription>
							Không thể tải thông tin đặt trước. Vui lòng thử lại.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end">
						<Button onClick={() => onOpenChange(false)}>Đóng</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="!max-w-7xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Chi tiết đặt trước</DialogTitle>
					<DialogDescription>
						Thông tin chi tiết về đặt trước sách
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Header với status - Full width */}
					<div className="lg:col-span-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Badge className={getStatusColor(reservation.status)}>
									{getStatusIcon(reservation.status)}
									<span className="ml-1">
										{getStatusText(reservation.status)}
									</span>
								</Badge>
								<span className="text-sm text-muted-foreground">
									ID: {reservation.id}
								</span>
							</div>
							<Button variant="outline" onClick={() => onOpenChange(false)}>
								Đóng
							</Button>
						</div>
						<Separator className="mt-4" />
					</div>

					{/* Thông tin sách */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Book className="h-5 w-5" />
								<span>Thông tin sách</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="grid grid-cols-1 gap-3">
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Tên sách
									</label>
									<p className="text-sm font-medium">
										{reservation.book?.title || 'N/A'}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										ISBN
									</label>
									<p className="text-sm">{reservation.book?.isbn || 'N/A'}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Năm xuất bản
									</label>
									<p className="text-sm">
										{reservation.book?.publish_year || 'N/A'}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Ngôn ngữ
									</label>
									<p className="text-sm">
										{reservation.book?.language || 'N/A'}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Số trang
									</label>
									<p className="text-sm">
										{reservation.book?.page_count || 'N/A'}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Loại sách
									</label>
									<p className="text-sm">
										{reservation.book?.book_type || 'N/A'}
									</p>
								</div>
							</div>
							{reservation.book?.description && (
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Mô tả
									</label>
									<p className="text-sm">{reservation.book.description}</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Thông tin độc giả */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<User className="h-5 w-5" />
								<span>Thông tin độc giả</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="grid grid-cols-1 gap-3">
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Họ tên
									</label>
									<p className="text-sm font-medium">
										{reservation.reader?.fullName || 'N/A'}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Số thẻ
									</label>
									<p className="text-sm">
										{reservation.reader?.cardNumber || 'N/A'}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Ngày sinh
									</label>
									<p className="text-sm">
										{formatDate(reservation.reader?.dob || '')}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Giới tính
									</label>
									<p className="text-sm">
										{reservation.reader?.gender || 'N/A'}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Số điện thoại
									</label>
									<p className="text-sm">
										{reservation.reader?.phone || 'N/A'}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Trạng thái
									</label>
									<Badge
										variant={
											reservation.reader?.isActive ? 'default' : 'secondary'
										}
									>
										{reservation.reader?.isActive
											? 'Hoạt động'
											: 'Không hoạt động'}
									</Badge>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Địa chỉ
									</label>
									<p className="text-sm">
										{reservation.reader?.address || 'N/A'}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Thông tin bản sao vật lý */}
					{reservation.physicalCopy && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<MapPin className="h-5 w-5" />
									<span>Thông tin bản sao vật lý</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="grid grid-cols-1 gap-3">
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Mã vạch
										</label>
										<p className="text-sm">
											{reservation.physicalCopy.barcode || 'N/A'}
										</p>
									</div>
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Trạng thái
										</label>
										<p className="text-sm">
											{reservation.physicalCopy.status || 'N/A'}
										</p>
									</div>
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Tình trạng
										</label>
										<p className="text-sm">
											{reservation.physicalCopy.current_condition || 'N/A'}
										</p>
									</div>
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Vị trí
										</label>
										<p className="text-sm">
											{reservation.physicalCopy.location || 'N/A'}
										</p>
									</div>
									{reservation.physicalCopy.notes && (
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Ghi chú
											</label>
											<p className="text-sm">
												{reservation.physicalCopy.notes}
											</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Thông tin đặt trước */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Calendar className="h-5 w-5" />
								<span>Thông tin đặt trước</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="grid grid-cols-1 gap-3">
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Ngày đặt
									</label>
									<p className="text-sm">
										{formatDate(reservation.reservation_date)}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Ngày hết hạn
									</label>
									<p className="text-sm">
										{formatDate(reservation.expiry_date)}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Độ ưu tiên
									</label>
									<p className="text-sm">{reservation.priority || 'N/A'}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">
										Ngày tạo
									</label>
									<p className="text-sm">
										{formatDate(reservation.created_at)}
									</p>
								</div>
								{reservation.reader_notes && (
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Ghi chú của độc giả
										</label>
										<p className="text-sm">{reservation.reader_notes}</p>
									</div>
								)}
								{reservation.librarian_notes && (
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Ghi chú của thủ thư
										</label>
										<p className="text-sm">{reservation.librarian_notes}</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Thông tin bổ sung - Full width khi có */}
					{reservation.fulfillment_date && (
						<div className="lg:col-span-2">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center space-x-2">
										<CheckCircle className="h-5 w-5 text-green-600" />
										<span>Thông tin thực hiện</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Ngày thực hiện
											</label>
											<p className="text-sm">
												{formatDate(reservation.fulfillment_date)}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Thực hiện bởi
											</label>
											<p className="capitalize text-sm">
												{`${user?.role} - ${user?.username}` || 'N/A'}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{reservation.cancelled_date && (
						<div className="lg:col-span-2">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center space-x-2">
										<XCircle className="h-5 w-5 text-red-600" />
										<span>Thông tin hủy</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Ngày hủy
											</label>
											<p className="text-sm">
												{formatDate(reservation.cancelled_date)}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Hủy bởi
											</label>
											<p className="text-sm">
												{reservation.cancelled_by || 'N/A'}
											</p>
										</div>
									</div>
									{reservation.cancellation_reason && (
										<div>
											<label className="text-sm font-medium text-muted-foreground">
												Lý do hủy
											</label>
											<p className="text-sm">
												{reservation.cancellation_reason}
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
