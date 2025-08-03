import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	useCancelReservation,
	useCreateReservation,
	useDeleteReservation,
	useFulfillReservation,
	useReservationStats,
	useReservations,
	useReservationsExpiringSoon,
} from '@/hooks/reservations';
import type { Reservation, ReservationStatus } from '@/types/reservations';
import {
	BookOpen,
	Calendar,
	CheckCircle,
	Clock,
	Plus,
	Search,
	Trash2,
	XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { CreateReservationDialog } from './components/create-reservation-dialog';

export default function ReservationsPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [activeTab, setActiveTab] = useState('all');
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	// Fetch reservations data
	const {
		reservations,
		isLoading: isLoadingReservations,
		meta,
	} = useReservations({
		page: 1,
		limit: 20,
		searchQuery: searchQuery || undefined,
	});

	// Fetch expiring soon reservations
	const { reservations: expiringSoonReservations } =
		useReservationsExpiringSoon({
			days: 3,
			page: 1,
			limit: 10,
			enabled: activeTab === 'expiring',
		});

	// Fetch statistics
	const { stats } = useReservationStats();

	// Mutations
	const createReservationMutation = useCreateReservation();
	const fulfillReservationMutation = useFulfillReservation();
	const cancelReservationMutation = useCancelReservation();
	const deleteReservationMutation = useDeleteReservation();

	const handleSearch = (value: string) => {
		setSearchQuery(value);
	};

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);
	};

	const handleCreateReservation = (data: any) => {
		createReservationMutation.mutate(data, {
			onSuccess: () => {
				setShowCreateDialog(false);
			},
		});
	};

	const handleFulfillReservation = (reservationId: string) => {
		fulfillReservationMutation.mutate(reservationId);
	};

	const handleCancelReservation = (reservationId: string) => {
		cancelReservationMutation.mutate(reservationId);
	};

	const handleDeleteReservation = (reservationId: string) => {
		if (confirm('Bạn có chắc chắn muốn xóa đặt trước này?')) {
			deleteReservationMutation.mutate(reservationId);
		}
	};

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

	const isExpiringSoon = (expiryDate: string) => {
		return calculateDaysUntilExpiry(expiryDate) <= 3;
	};

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
				<Button onClick={() => setShowCreateDialog(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Tạo Đặt Trước
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tổng số Đặt Trước
						</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats?.total || 0}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Đang chờ</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-yellow-600">
							{stats?.pending || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Đã thực hiện</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{stats?.fulfilled || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Đã hủy</CardTitle>
						<XCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{stats?.cancelled || 0}
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
					<TabsTrigger value="all">Tất cả Đặt Trước</TabsTrigger>
					<TabsTrigger value="expiring">Sắp hết hạn</TabsTrigger>
				</TabsList>

				{/* Search and Filter */}
				<div className="flex gap-4">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Tìm kiếm đặt trước..."
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
							<SelectItem value="pending">Đang chờ</SelectItem>
							<SelectItem value="fulfilled">Đã thực hiện</SelectItem>
							<SelectItem value="cancelled">Đã hủy</SelectItem>
							<SelectItem value="expired">Hết hạn</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Reservations List */}
				<TabsContent value="all" className="space-y-4">
					{isLoadingReservations ? (
						<div className="text-center py-8">Đang tải...</div>
					) : reservations.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							Không có đặt trước nào
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{reservations.map((reservation: Reservation) => (
								<Card
									key={reservation.id}
									className="hover:shadow-lg transition-shadow"
								>
									<CardHeader>
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<CardTitle className="text-lg">
													{reservation.book?.title || 'Không có tên sách'}
												</CardTitle>
												<CardDescription>
													Độc giả:{' '}
													{reservation.reader?.full_name ||
														'Không có tên độc giả'}
												</CardDescription>
											</div>
											<Badge className={getStatusColor(reservation.status)}>
												{getStatusIcon(reservation.status)}
												<span className="ml-1">
													{reservation.status === 'pending' && 'Đang chờ'}
													{reservation.status === 'fulfilled' && 'Đã thực hiện'}
													{reservation.status === 'cancelled' && 'Đã hủy'}
													{reservation.status === 'expired' && 'Hết hạn'}
												</span>
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>Ngày đặt:</span>
												<span>{formatDate(reservation.reservation_date)}</span>
											</div>
											<div className="flex justify-between text-sm">
												<span>Hạn hết:</span>
												<span
													className={
														isExpiringSoon(reservation.expiry_date)
															? 'text-yellow-600 font-semibold'
															: ''
													}
												>
													{formatDate(reservation.expiry_date)}
												</span>
											</div>
											{reservation.status === 'pending' &&
												isExpiringSoon(reservation.expiry_date) && (
													<div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
														Còn{' '}
														{calculateDaysUntilExpiry(reservation.expiry_date)}{' '}
														ngày đến hạn
													</div>
												)}
											{reservation.status === 'expired' && (
												<div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
													Đã hết hạn
												</div>
											)}
										</div>
										<div className="flex gap-2 mt-4">
											{reservation.status === 'pending' && (
												<Button
													size="sm"
													className="flex-1"
													onClick={() =>
														handleFulfillReservation(reservation.id)
													}
													disabled={fulfillReservationMutation.isPending}
												>
													Thực hiện
												</Button>
											)}
											{reservation.status === 'pending' && (
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														handleCancelReservation(reservation.id)
													}
													disabled={cancelReservationMutation.isPending}
												>
													Hủy
												</Button>
											)}
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleDeleteReservation(reservation.id)}
												disabled={deleteReservationMutation.isPending}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value="expiring" className="space-y-4">
					{expiringSoonReservations.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							Không có đặt trước nào sắp hết hạn
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{expiringSoonReservations.map((reservation: Reservation) => (
								<Card
									key={reservation.id}
									className="hover:shadow-lg transition-shadow border-yellow-200"
								>
									<CardHeader>
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<CardTitle className="text-lg">
													{reservation.book?.title || 'Không có tên sách'}
												</CardTitle>
												<CardDescription>
													Độc giả:{' '}
													{reservation.reader?.full_name ||
														'Không có tên độc giả'}
												</CardDescription>
											</div>
											<Badge className="bg-yellow-100 text-yellow-800">
												<Clock className="mr-1 h-3 w-3" />
												Sắp hết hạn
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>Ngày đặt:</span>
												<span>{formatDate(reservation.reservation_date)}</span>
											</div>
											<div className="flex justify-between text-sm">
												<span>Hạn hết:</span>
												<span className="text-yellow-600 font-semibold">
													{formatDate(reservation.expiry_date)}
												</span>
											</div>
											<div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
												Còn {calculateDaysUntilExpiry(reservation.expiry_date)}{' '}
												ngày đến hạn
											</div>
										</div>
										<div className="flex gap-2 mt-4">
											<Button
												size="sm"
												className="flex-1"
												onClick={() => handleFulfillReservation(reservation.id)}
												disabled={fulfillReservationMutation.isPending}
											>
												Thực hiện
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleCancelReservation(reservation.id)}
												disabled={cancelReservationMutation.isPending}
											>
												Hủy
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>

			{/* Create Reservation Dialog */}
			<CreateReservationDialog
				open={showCreateDialog}
				onOpenChange={setShowCreateDialog}
				onSubmit={handleCreateReservation}
				isLoading={createReservationMutation.isPending}
			/>
		</div>
	);
}
