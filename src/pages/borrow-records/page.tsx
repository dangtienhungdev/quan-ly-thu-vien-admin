import { BorrowRecordsAPI } from '@/apis';
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
import type { BorrowStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';
import {
	AlertTriangle,
	BookOpen,
	Calendar,
	CheckCircle,
	Plus,
	Search,
} from 'lucide-react';
import { useState } from 'react';

export default function BorrowRecordsPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [activeTab, setActiveTab] = useState('all');

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

	// Fetch due soon records
	const { data: dueSoonRecords } = useQuery({
		queryKey: ['borrow-records-due-soon'],
		queryFn: () => BorrowRecordsAPI.getDueSoon({ days: 3, page: 1, limit: 10 }),
	});

	// Fetch statistics
	const { data: stats } = useQuery({
		queryKey: ['borrow-records-stats'],
		queryFn: () => BorrowRecordsAPI.getStats(),
	});

	const handleSearch = (value: string) => {
		setSearchQuery(value);
	};

	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);
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

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Quản lý Mượn Trả</h1>
					<p className="text-muted-foreground">
						Theo dõi và quản lý các giao dịch mượn trả sách trong thư viện
					</p>
				</div>
				<Button>
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
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{borrowRecordsData?.data.map((record) => (
								<Card
									key={record.id}
									className="hover:shadow-lg transition-shadow"
								>
									<CardHeader>
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<CardTitle className="text-lg">
													{record.copy?.book?.title}
												</CardTitle>
												<CardDescription>
													Độc giả: {record.reader?.full_name}
												</CardDescription>
											</div>
											<Badge className={getStatusColor(record.status)}>
												{getStatusIcon(record.status)}
												<span className="ml-1">{record.status}</span>
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>Ngày mượn:</span>
												<span>{formatDate(record.borrow_date)}</span>
											</div>
											<div className="flex justify-between text-sm">
												<span>Hạn trả:</span>
												<span
													className={
														record.status === 'overdue'
															? 'text-red-600 font-semibold'
															: ''
													}
												>
													{formatDate(record.due_date)}
												</span>
											</div>
											{record.return_date && (
												<div className="flex justify-between text-sm">
													<span>Ngày trả:</span>
													<span>{formatDate(record.return_date)}</span>
												</div>
											)}
											{record.status === 'overdue' && (
												<div className="text-sm text-red-600 bg-red-50 p-2 rounded">
													Quá hạn {calculateDaysOverdue(record.due_date)} ngày
												</div>
											)}
											{record.status === 'borrowed' &&
												calculateDaysUntilDue(record.due_date) <= 3 && (
													<div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
														Còn {calculateDaysUntilDue(record.due_date)} ngày
														đến hạn
													</div>
												)}
										</div>
										<div className="flex gap-2 mt-4">
											{record.status === 'borrowed' && (
												<Button size="sm" className="flex-1">
													Trả sách
												</Button>
											)}
											{record.status === 'borrowed' && (
												<Button variant="outline" size="sm">
													Gia hạn
												</Button>
											)}
											<Button variant="outline" size="sm">
												Chi tiết
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value="overdue" className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{overdueRecords?.data.map((record) => (
							<Card
								key={record.id}
								className="hover:shadow-lg transition-shadow border-red-200"
							>
								<CardHeader>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<CardTitle className="text-lg">
												{record.copy?.book?.title}
											</CardTitle>
											<CardDescription>
												Độc giả: {record.reader?.full_name}
											</CardDescription>
										</div>
										<Badge className="bg-red-100 text-red-800">
											<AlertTriangle className="mr-1 h-3 w-3" />
											Quá hạn
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Ngày mượn:</span>
											<span>{formatDate(record.borrow_date)}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Hạn trả:</span>
											<span className="text-red-600 font-semibold">
												{formatDate(record.due_date)}
											</span>
										</div>
										<div className="text-sm text-red-600 bg-red-50 p-2 rounded">
											Quá hạn {calculateDaysOverdue(record.due_date)} ngày
										</div>
									</div>
									<div className="flex gap-2 mt-4">
										<Button size="sm" className="flex-1">
											Trả sách
										</Button>
										<Button variant="outline" size="sm">
											Gửi nhắc nhở
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="due-soon" className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{dueSoonRecords?.data.map((record) => (
							<Card
								key={record.id}
								className="hover:shadow-lg transition-shadow border-yellow-200"
							>
								<CardHeader>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<CardTitle className="text-lg">
												{record.copy?.book?.title}
											</CardTitle>
											<CardDescription>
												Độc giả: {record.reader?.full_name}
											</CardDescription>
										</div>
										<Badge className="bg-yellow-100 text-yellow-800">
											<Calendar className="mr-1 h-3 w-3" />
											Sắp đến hạn
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Ngày mượn:</span>
											<span>{formatDate(record.borrow_date)}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Hạn trả:</span>
											<span className="text-yellow-600 font-semibold">
												{formatDate(record.due_date)}
											</span>
										</div>
										<div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
											Còn {calculateDaysUntilDue(record.due_date)} ngày đến hạn
										</div>
									</div>
									<div className="flex gap-2 mt-4">
										<Button variant="outline" size="sm" className="flex-1">
											Gia hạn
										</Button>
										<Button variant="outline" size="sm">
											Gửi nhắc nhở
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
