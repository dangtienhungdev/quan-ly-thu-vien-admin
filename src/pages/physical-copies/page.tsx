import { PhysicalCopiesAPI } from '@/apis';
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
import type { CopyCondition, CopyStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';
import {
	AlertTriangle,
	BookOpen,
	CheckCircle,
	MapPin,
	Plus,
	Search,
} from 'lucide-react';
import { useState } from 'react';

export default function PhysicalCopiesPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [selectedCondition, setSelectedCondition] = useState<string>('all');
	const [activeTab, setActiveTab] = useState('all');

	// Fetch physical copies data
	const { data: copiesData, isLoading: isLoadingCopies } = useQuery({
		queryKey: [
			'physical-copies',
			{
				search: searchQuery,
				status: selectedStatus,
				condition: selectedCondition,
			},
		],
		queryFn: () => PhysicalCopiesAPI.getAll({ page: 1, limit: 20 }),
	});

	// Fetch available copies
	const { data: availableCopies } = useQuery({
		queryKey: ['physical-copies-available'],
		queryFn: () => PhysicalCopiesAPI.getAvailable({ page: 1, limit: 10 }),
	});

	// Fetch maintenance copies
	const { data: maintenanceCopies } = useQuery({
		queryKey: ['physical-copies-maintenance'],
		queryFn: () => PhysicalCopiesAPI.getMaintenance({ page: 1, limit: 10 }),
	});

	// Fetch statistics
	const { data: stats } = useQuery({
		queryKey: ['physical-copies-stats'],
		queryFn: () => PhysicalCopiesAPI.getStats(),
	});

	const handleSearch = (value: string) => {
		setSearchQuery(value);
	};

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);
	};

	const handleConditionFilter = (condition: string) => {
		setSelectedCondition(condition);
	};

	const getStatusColor = (status: CopyStatus) => {
		const colors: Record<CopyStatus, string> = {
			available: 'bg-green-100 text-green-800',
			borrowed: 'bg-blue-100 text-blue-800',
			reserved: 'bg-yellow-100 text-yellow-800',
			damaged: 'bg-red-100 text-red-800',
			lost: 'bg-gray-100 text-gray-800',
			maintenance: 'bg-orange-100 text-orange-800',
		};
		return colors[status];
	};

	const getConditionColor = (condition: CopyCondition) => {
		const colors: Record<CopyCondition, string> = {
			new: 'bg-green-100 text-green-800',
			good: 'bg-blue-100 text-blue-800',
			worn: 'bg-yellow-100 text-yellow-800',
			damaged: 'bg-red-100 text-red-800',
		};
		return colors[condition];
	};

	const getStatusIcon = (status: CopyStatus) => {
		switch (status) {
			case 'available':
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case 'borrowed':
				return <BookOpen className="h-4 w-4 text-blue-600" />;
			case 'reserved':
				return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
			case 'damaged':
			case 'lost':
			case 'maintenance':
				return <AlertTriangle className="h-4 w-4 text-red-600" />;
			default:
				return null;
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(amount);
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Quản lý Bản sao Vật lý</h1>
					<p className="text-muted-foreground">
						Quản lý và theo dõi các bản sao sách vật lý trong thư viện
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Thêm Bản sao
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tổng số Bản sao
						</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats?.total || 0}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Sẵn sàng cho mượn
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{stats?.available || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Đang được mượn
						</CardTitle>
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
						<CardTitle className="text-sm font-medium">Cần bảo trì</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">
							{stats?.maintenance || 0}
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
					<TabsTrigger value="all">Tất cả Bản sao</TabsTrigger>
					<TabsTrigger value="available">Sẵn sàng</TabsTrigger>
					<TabsTrigger value="maintenance">Bảo trì</TabsTrigger>
				</TabsList>

				{/* Search and Filter */}
				<div className="flex gap-4">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Tìm kiếm bản sao..."
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
							<SelectItem value="available">Sẵn sàng</SelectItem>
							<SelectItem value="borrowed">Đang mượn</SelectItem>
							<SelectItem value="reserved">Đã đặt</SelectItem>
							<SelectItem value="damaged">Hư hỏng</SelectItem>
							<SelectItem value="lost">Bị mất</SelectItem>
							<SelectItem value="maintenance">Bảo trì</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={selectedCondition}
						onValueChange={handleConditionFilter}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Tình trạng" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả tình trạng</SelectItem>
							<SelectItem value="new">Mới</SelectItem>
							<SelectItem value="good">Tốt</SelectItem>
							<SelectItem value="worn">Cũ</SelectItem>
							<SelectItem value="damaged">Hư hỏng</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Physical Copies List */}
				<TabsContent value="all" className="space-y-4">
					{isLoadingCopies ? (
						<div className="text-center py-8">Đang tải...</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{copiesData?.data.map((copy) => (
								<Card
									key={copy.id}
									className="hover:shadow-lg transition-shadow"
								>
									<CardHeader>
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<CardTitle className="text-lg">
													{copy.book?.title}
												</CardTitle>
												<CardDescription>
													Barcode: {copy.barcode}
												</CardDescription>
											</div>
											<div className="flex flex-col gap-1">
												<Badge className={getStatusColor(copy.status)}>
													{getStatusIcon(copy.status)}
													<span className="ml-1">{copy.status}</span>
												</Badge>
												<Badge
													className={getConditionColor(copy.current_condition)}
												>
													{copy.current_condition}
												</Badge>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>Vị trí:</span>
												<span className="flex items-center">
													<MapPin className="mr-1 h-3 w-3" />
													{copy.location}
												</span>
											</div>
											<div className="flex justify-between text-sm">
												<span>Giá mua:</span>
												<span>{formatCurrency(copy.purchase_price)}</span>
											</div>
											<div className="flex justify-between text-sm">
												<span>Ngày mua:</span>
												<span>
													{new Date(copy.purchase_date).toLocaleDateString(
														'vi-VN'
													)}
												</span>
											</div>
											{copy.condition_details && (
												<div className="text-sm text-muted-foreground">
													{copy.condition_details}
												</div>
											)}
										</div>
										<div className="flex gap-2 mt-4">
											<Button variant="outline" size="sm" className="flex-1">
												Chi tiết
											</Button>
											<Button variant="outline" size="sm">
												Cập nhật
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value="available" className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{availableCopies?.data.map((copy) => (
							<Card
								key={copy.id}
								className="hover:shadow-lg transition-shadow border-green-200"
							>
								<CardHeader>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<CardTitle className="text-lg">
												{copy.book?.title}
											</CardTitle>
											<CardDescription>Barcode: {copy.barcode}</CardDescription>
										</div>
										<div className="flex flex-col gap-1">
											<Badge className="bg-green-100 text-green-800">
												<CheckCircle className="mr-1 h-3 w-3" />
												Sẵn sàng
											</Badge>
											<Badge
												className={getConditionColor(copy.current_condition)}
											>
												{copy.current_condition}
											</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Vị trí:</span>
											<span className="flex items-center">
												<MapPin className="mr-1 h-3 w-3" />
												{copy.location}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Giá mua:</span>
											<span>{formatCurrency(copy.purchase_price)}</span>
										</div>
									</div>
									<div className="flex gap-2 mt-4">
										<Button size="sm" className="flex-1">
											Cho mượn
										</Button>
										<Button variant="outline" size="sm">
											Chi tiết
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="maintenance" className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{maintenanceCopies?.data.map((copy) => (
							<Card
								key={copy.id}
								className="hover:shadow-lg transition-shadow border-orange-200"
							>
								<CardHeader>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<CardTitle className="text-lg">
												{copy.book?.title}
											</CardTitle>
											<CardDescription>Barcode: {copy.barcode}</CardDescription>
										</div>
										<div className="flex flex-col gap-1">
											<Badge className="bg-orange-100 text-orange-800">
												<AlertTriangle className="mr-1 h-3 w-3" />
												Bảo trì
											</Badge>
											<Badge
												className={getConditionColor(copy.current_condition)}
											>
												{copy.current_condition}
											</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Vị trí:</span>
											<span className="flex items-center">
												<MapPin className="mr-1 h-3 w-3" />
												{copy.location}
											</span>
										</div>
										{copy.condition_details && (
											<div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
												{copy.condition_details}
											</div>
										)}
									</div>
									<div className="flex gap-2 mt-4">
										<Button variant="outline" size="sm" className="flex-1">
											Hoàn thành bảo trì
										</Button>
										<Button variant="outline" size="sm">
											Chi tiết
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
