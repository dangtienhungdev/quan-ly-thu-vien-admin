import { EBooksAPI } from '@/apis';
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
import { useQuery } from '@tanstack/react-query';
import {
	BarChart3,
	Download,
	FileText,
	Filter,
	Plus,
	Search,
} from 'lucide-react';
import { useState } from 'react';

export default function EBooksPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedFormat, setSelectedFormat] = useState<string>('all');
	const [activeTab, setActiveTab] = useState('all');

	// Fetch ebooks data
	const { data: ebooksData, isLoading: isLoadingEbooks } = useQuery({
		queryKey: ['ebooks', { search: searchQuery, format: selectedFormat }],
		queryFn: () => EBooksAPI.getAll({ page: 1, limit: 20 }),
	});

	// Fetch popular ebooks
	const { data: popularEbooks } = useQuery({
		queryKey: ['ebooks-popular'],
		queryFn: () => EBooksAPI.getPopular(5),
	});

	// Fetch recent ebooks
	const { data: recentEbooks } = useQuery({
		queryKey: ['ebooks-recent'],
		queryFn: () => EBooksAPI.getRecent(5),
	});

	// Fetch statistics
	const { data: stats } = useQuery({
		queryKey: ['ebooks-stats'],
		queryFn: () => EBooksAPI.getStats(),
	});

	const handleSearch = (value: string) => {
		setSearchQuery(value);
	};

	const handleFormatFilter = (format: string) => {
		setSelectedFormat(format);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	const getFormatColor = (format: string) => {
		const colors: Record<string, string> = {
			PDF: 'bg-red-100 text-red-800',
			EPUB: 'bg-blue-100 text-blue-800',
			MOBI: 'bg-green-100 text-green-800',
			AZW: 'bg-purple-100 text-purple-800',
			TXT: 'bg-gray-100 text-gray-800',
			DOCX: 'bg-orange-100 text-orange-800',
		};
		return colors[format] || 'bg-gray-100 text-gray-800';
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Quản lý Sách Điện tử</h1>
					<p className="text-muted-foreground">
						Quản lý và theo dõi các sách điện tử trong thư viện
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Thêm EBook
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Tổng số EBook</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats?.total || 0}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Tổng lượt tải</CardTitle>
						<Download className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats?.totalDownloads || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Dung lượng tổng
						</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats?.totalSize ? formatFileSize(stats.totalSize) : '0 MB'}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Định dạng phổ biến
						</CardTitle>
						<Filter className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats?.byFormat?.[0]?.format || 'PDF'}
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
					<TabsTrigger value="all">Tất cả EBook</TabsTrigger>
					<TabsTrigger value="popular">Phổ biến</TabsTrigger>
					<TabsTrigger value="recent">Mới nhất</TabsTrigger>
				</TabsList>

				{/* Search and Filter */}
				<div className="flex gap-4">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Tìm kiếm ebook..."
								value={searchQuery}
								onChange={(e) => handleSearch(e.target.value)}
								className="pl-8"
							/>
						</div>
					</div>
					<Select value={selectedFormat} onValueChange={handleFormatFilter}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Định dạng" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả định dạng</SelectItem>
							<SelectItem value="PDF">PDF</SelectItem>
							<SelectItem value="EPUB">EPUB</SelectItem>
							<SelectItem value="MOBI">MOBI</SelectItem>
							<SelectItem value="AZW">AZW</SelectItem>
							<SelectItem value="TXT">TXT</SelectItem>
							<SelectItem value="DOCX">DOCX</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* EBooks List */}
				<TabsContent value="all" className="space-y-4">
					{isLoadingEbooks ? (
						<div className="text-center py-8">Đang tải...</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{ebooksData?.data.map((ebook) => (
								<Card
									key={ebook.id}
									className="hover:shadow-lg transition-shadow"
								>
									<CardHeader>
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<CardTitle className="text-lg">
													{ebook.book?.title}
												</CardTitle>
												<CardDescription>{ebook.book?.isbn}</CardDescription>
											</div>
											<Badge className={getFormatColor(ebook.file_format)}>
												{ebook.file_format}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>Kích thước:</span>
												<span>{formatFileSize(ebook.file_size)}</span>
											</div>
											<div className="flex justify-between text-sm">
												<span>Lượt tải:</span>
												<span>{ebook.download_count}</span>
											</div>
											<div className="flex justify-between text-sm">
												<span>Ngày tạo:</span>
												<span>
													{new Date(ebook.created_at).toLocaleDateString(
														'vi-VN'
													)}
												</span>
											</div>
										</div>
										<div className="flex gap-2 mt-4">
											<Button variant="outline" size="sm" className="flex-1">
												<Download className="mr-2 h-4 w-4" />
												Tải xuống
											</Button>
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

				<TabsContent value="popular" className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{popularEbooks?.map((ebook) => (
							<Card
								key={ebook.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<CardTitle className="text-lg">
												{ebook.book?.title}
											</CardTitle>
											<CardDescription>{ebook.book?.isbn}</CardDescription>
										</div>
										<Badge className={getFormatColor(ebook.file_format)}>
											{ebook.file_format}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Lượt tải:</span>
											<span className="font-semibold text-green-600">
												{ebook.download_count}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Kích thước:</span>
											<span>{formatFileSize(ebook.file_size)}</span>
										</div>
									</div>
									<div className="flex gap-2 mt-4">
										<Button variant="outline" size="sm" className="flex-1">
											<Download className="mr-2 h-4 w-4" />
											Tải xuống
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

				<TabsContent value="recent" className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{recentEbooks?.map((ebook) => (
							<Card
								key={ebook.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<CardTitle className="text-lg">
												{ebook.book?.title}
											</CardTitle>
											<CardDescription>{ebook.book?.isbn}</CardDescription>
										</div>
										<Badge className={getFormatColor(ebook.file_format)}>
											{ebook.file_format}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Ngày tạo:</span>
											<span className="font-semibold text-blue-600">
												{new Date(ebook.created_at).toLocaleDateString('vi-VN')}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Kích thước:</span>
											<span>{formatFileSize(ebook.file_size)}</span>
										</div>
									</div>
									<div className="flex gap-2 mt-4">
										<Button variant="outline" size="sm" className="flex-1">
											<Download className="mr-2 h-4 w-4" />
											Tải xuống
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
