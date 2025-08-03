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
import {
	useApproveRenewal,
	useDeleteRenewal,
	useRejectRenewal,
	useRenewalStats,
	useRenewalsByStatus,
} from '@/hooks/renewals';
import { useRenewals } from '@/hooks/renewals/use-renewals';
import type { Renewal, RenewalStatus } from '@/types/renewals';
import {
	CheckCircle,
	Clock,
	Eye,
	Plus,
	Search,
	Trash2,
	XCircle,
} from 'lucide-react';
import { useState } from 'react';

export default function RenewalsPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [activeTab, setActiveTab] = useState('all');

	// Fetch renewals data
	const {
		renewals,
		isLoading: isLoadingRenewals,
		meta,
	} = useRenewals({
		page: 1,
		limit: 20,
		searchQuery: searchQuery || undefined,
	});

	// Fetch renewals by status
	const { renewals: pendingRenewals } = useRenewalsByStatus({
		status: 'pending',
		page: 1,
		limit: 20,
		enabled: activeTab === 'pending',
	});

	const { renewals: approvedRenewals } = useRenewalsByStatus({
		status: 'approved',
		page: 1,
		limit: 20,
		enabled: activeTab === 'approved',
	});

	const { renewals: rejectedRenewals } = useRenewalsByStatus({
		status: 'rejected',
		page: 1,
		limit: 20,
		enabled: activeTab === 'rejected',
	});

	// Fetch statistics
	const { stats } = useRenewalStats();

	// Mutations
	const approveRenewalMutation = useApproveRenewal();
	const rejectRenewalMutation = useRejectRenewal();
	const deleteRenewalMutation = useDeleteRenewal();

	const handleSearch = (value: string) => {
		setSearchQuery(value);
	};

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);
	};

	const handleApproveRenewal = (renewalId: string, notes?: string) => {
		approveRenewalMutation.mutate({
			id: renewalId,
			data: { librarianNotes: notes },
		});
	};

	const handleRejectRenewal = (renewalId: string, notes?: string) => {
		rejectRenewalMutation.mutate({
			id: renewalId,
			data: { librarianNotes: notes },
		});
	};

	const handleDeleteRenewal = (renewalId: string) => {
		if (confirm('Bạn có chắc chắn muốn xóa yêu cầu gia hạn này?')) {
			deleteRenewalMutation.mutate(renewalId);
		}
	};

	const getStatusColor = (status: RenewalStatus) => {
		const colors: Record<RenewalStatus, string> = {
			pending: 'bg-yellow-100 text-yellow-800',
			approved: 'bg-green-100 text-green-800',
			rejected: 'bg-red-100 text-red-800',
		};
		return colors[status];
	};

	const getStatusIcon = (status: RenewalStatus) => {
		switch (status) {
			case 'pending':
				return <Clock className="h-4 w-4 text-yellow-600" />;
			case 'approved':
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case 'rejected':
				return <XCircle className="h-4 w-4 text-red-600" />;
			default:
				return null;
		}
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('vi-VN');
	};

	const renderRenewalRow = (renewal: Renewal) => {
		return (
			<TableRow key={renewal.id}>
				<TableCell className="font-medium">
					{renewal.borrow?.physicalCopy?.book?.title || 'Không có tên sách'}
				</TableCell>
				<TableCell>
					{renewal.borrow?.reader?.fullName || 'Không có tên độc giả'}
					<br />
					<span className="text-sm text-muted-foreground">
						{renewal.borrow?.reader?.cardNumber || 'Không có mã thẻ'}
					</span>
				</TableCell>
				<TableCell>{formatDate(renewal.renewal_date)}</TableCell>
				<TableCell>{formatDate(renewal.new_due_date)}</TableCell>
				<TableCell>
					<Badge className={getStatusColor(renewal.status)}>
						{getStatusIcon(renewal.status)}
						<span className="ml-1">
							{renewal.status === 'pending' && 'Đang chờ'}
							{renewal.status === 'approved' && 'Đã phê duyệt'}
							{renewal.status === 'rejected' && 'Bị từ chối'}
						</span>
					</Badge>
				</TableCell>
				<TableCell>
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" title="Xem chi tiết">
							<Eye className="h-4 w-4" />
						</Button>
						{renewal.status === 'pending' && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleApproveRenewal(renewal.id)}
									title="Phê duyệt"
									disabled={approveRenewalMutation.isPending}
								>
									<CheckCircle className="h-4 w-4 text-green-600" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleRejectRenewal(renewal.id)}
									title="Từ chối"
									disabled={rejectRenewalMutation.isPending}
								>
									<XCircle className="h-4 w-4 text-red-600" />
								</Button>
							</>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleDeleteRenewal(renewal.id)}
							title="Xóa yêu cầu"
							disabled={deleteRenewalMutation.isPending}
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
					<h1 className="text-3xl font-bold">Quản lý Gia Hạn Sách</h1>
					<p className="text-muted-foreground">
						Quản lý các yêu cầu gia hạn sách trong thư viện
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Tạo Yêu cầu Gia Hạn
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tổng số Yêu cầu
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
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
						<CardTitle className="text-sm font-medium">Đã phê duyệt</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{stats?.approved || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Bị từ chối</CardTitle>
						<XCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{stats?.rejected || 0}
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
					<TabsTrigger value="all">Tất cả Yêu cầu</TabsTrigger>
					<TabsTrigger value="pending">Đang chờ</TabsTrigger>
					<TabsTrigger value="approved">Đã phê duyệt</TabsTrigger>
					<TabsTrigger value="rejected">Bị từ chối</TabsTrigger>
				</TabsList>

				{/* Search and Filter */}
				<div className="flex gap-4">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Tìm kiếm yêu cầu gia hạn..."
								value={searchQuery}
								onChange={(e) => handleSearch(e.target.value)}
								className="pl-8"
							/>
						</div>
					</div>
					<Select value={selectedStatus} onValueChange={handleStatusFilter}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Lọc theo trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả</SelectItem>
							<SelectItem value="pending">Đang chờ</SelectItem>
							<SelectItem value="approved">Đã phê duyệt</SelectItem>
							<SelectItem value="rejected">Bị từ chối</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Content Tabs */}
				<TabsContent value="all" className="space-y-4">
					{isLoadingRenewals ? (
						<div className="text-center py-8">Đang tải...</div>
					) : renewals.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							Không có yêu cầu gia hạn nào
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Sách</TableHead>
										<TableHead>Độc giả</TableHead>
										<TableHead>Ngày gia hạn</TableHead>
										<TableHead>Hạn trả mới</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead>Hành động</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{renewals.map((renewal: Renewal) =>
										renderRenewalRow(renewal)
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</TabsContent>

				<TabsContent value="pending" className="space-y-4">
					{pendingRenewals.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							Không có yêu cầu đang chờ
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Sách</TableHead>
										<TableHead>Độc giả</TableHead>
										<TableHead>Ngày gia hạn</TableHead>
										<TableHead>Hạn trả mới</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead>Hành động</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pendingRenewals.map((renewal: Renewal) =>
										renderRenewalRow(renewal)
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</TabsContent>

				<TabsContent value="approved" className="space-y-4">
					{approvedRenewals.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							Không có yêu cầu đã phê duyệt
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Sách</TableHead>
										<TableHead>Độc giả</TableHead>
										<TableHead>Ngày gia hạn</TableHead>
										<TableHead>Hạn trả mới</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead>Hành động</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{approvedRenewals.map((renewal: Renewal) =>
										renderRenewalRow(renewal)
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</TabsContent>

				<TabsContent value="rejected" className="space-y-4">
					{rejectedRenewals.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							Không có yêu cầu bị từ chối
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Sách</TableHead>
										<TableHead>Độc giả</TableHead>
										<TableHead>Ngày gia hạn</TableHead>
										<TableHead>Hạn trả mới</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead>Hành động</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{rejectedRenewals.map((renewal: Renewal) =>
										renderRenewalRow(renewal)
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
