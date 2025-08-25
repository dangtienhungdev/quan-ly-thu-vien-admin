import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Plus, Search } from 'lucide-react';
import type { Fine, FineWithBorrowDetails } from '@/types/fines';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { CreateFineDialog } from './components/create-fine-dialog';
import { DataTable } from '@/components/ui/data-table';
import { FineStatisticsCards } from './components/fine-statistics-cards';
import { FinesAPI } from '@/apis/fines';
import { Input } from '@/components/ui/input';
import { PayFineDialog } from './components/pay-fine-dialog';
import { columns } from './components/columns';
import { toast } from 'sonner';
import { useState } from 'react';

export default function FinesPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<'all' | 'unpaid' | 'paid'>(
		'all'
	);
	const [selectedFine, setSelectedFine] =
		useState<FineWithBorrowDetails | null>(null);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [showPayDialog, setShowPayDialog] = useState(false);

	const queryClient = useQueryClient();

	// Query để lấy danh sách fines
	const {
		data: finesResponse,
		isLoading: isLoadingFines,
		refetch: refetchFines,
	} = useQuery({
		queryKey: ['fines', statusFilter],
		queryFn: async () => {
			if (statusFilter === 'unpaid') {
				return await FinesAPI.getByStatus('unpaid');
			} else if (statusFilter === 'paid') {
				return await FinesAPI.getByStatus('paid');
			} else {
				return await FinesAPI.getAll();
			}
		},
	});
	console.log('🚀 ~ FinesPage ~ finesResponse:', finesResponse);

	// Query để lấy thống kê
	const { data: statistics } = useQuery({
		queryKey: ['fines-stats'],
		queryFn: async () => {
			return await FinesAPI.getStats();
		},
	});

	// Query để tìm kiếm
	const {
		data: searchResponse,
		isLoading: isSearching,
		refetch: searchFines,
	} = useQuery({
		queryKey: ['fines-search', searchQuery],
		queryFn: async () => {
			if (!searchQuery.trim()) {
				return await FinesAPI.getAll();
			}
			return await FinesAPI.search(searchQuery);
		},
		enabled: false, // Chỉ chạy khi gọi searchFines()
	});

	// Mutation để xuất báo cáo
	const exportMutation = useMutation({
		mutationFn: async () => {
			return await FinesAPI.exportReport();
		},
		onSuccess: (blob) => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `fines-report-${
				new Date().toISOString().split('T')[0]
			}.xlsx`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
			toast.success('Xuất báo cáo thành công!');
		},
		onError: (error) => {
			console.error('Error exporting fines:', error);
			toast.error('Có lỗi xảy ra khi xuất báo cáo');
		},
	});

	const handleSearch = () => {
		if (searchQuery.trim()) {
			searchFines();
		} else {
			refetchFines();
		}
	};

	const handlePayFine = (fine: Fine) => {
		setSelectedFine(fine as FineWithBorrowDetails);
		setShowPayDialog(true);
	};

	const handleFinePaid = () => {
		queryClient.invalidateQueries({ queryKey: ['fines'] });
		queryClient.invalidateQueries({ queryKey: ['fines-stats'] });
		setShowPayDialog(false);
	};

	const handleFineCreated = () => {
		queryClient.invalidateQueries({ queryKey: ['fines'] });
		queryClient.invalidateQueries({ queryKey: ['fines-stats'] });
		setShowCreateDialog(false);
	};

	const handleExport = () => {
		exportMutation.mutate();
	};

	// Sử dụng data từ search hoặc fines tùy theo trạng thái
	const fines = searchQuery.trim()
		? searchResponse?.data || []
		: finesResponse?.data || [];
	const loading = isLoadingFines || isSearching;

	// Filter fines theo status (nếu cần)
	const filteredFines = fines.filter((fine) => {
		if (statusFilter === 'unpaid') return fine.status === 'unpaid';
		if (statusFilter === 'paid') return fine.status === 'paid';
		return true;
	}) as FineWithBorrowDetails[];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Quản lý Phạt</h1>
					<p className="text-muted-foreground">
						Quản lý các khoản phạt trong thư viện
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={handleExport}
						disabled={exportMutation.isPending}
					>
						<Download className="h-4 w-4 mr-2" />
						{exportMutation.isPending ? 'Đang xuất...' : 'Xuất báo cáo'}
					</Button>
					<Button onClick={() => setShowCreateDialog(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Tạo phạt mới
					</Button>
				</div>
			</div>

			{/* Statistics */}
			{statistics && <FineStatisticsCards statistics={statistics} />}

			{/* Search and Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Tìm kiếm và lọc</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
								<Input
									placeholder="Tìm kiếm theo tên độc giả, tên sách..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
									className="pl-10"
								/>
							</div>
						</div>
						<Button onClick={handleSearch} disabled={isSearching}>
							<Search className="h-4 w-4 mr-2" />
							{isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Main Content */}
			<Tabs defaultValue="all" className="space-y-4">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="all" onClick={() => setStatusFilter('all')}>
						Tất cả ({fines.length})
					</TabsTrigger>
					<TabsTrigger value="unpaid" onClick={() => setStatusFilter('unpaid')}>
						Chưa thanh toán ({fines.filter((f) => f.status === 'unpaid').length}
						)
					</TabsTrigger>
					<TabsTrigger value="paid" onClick={() => setStatusFilter('paid')}>
						Đã thanh toán ({fines.filter((f) => f.status === 'paid').length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="space-y-4">
					<DataTable
						columns={columns(handlePayFine)}
						data={filteredFines}
						loading={loading}
					/>
				</TabsContent>

				<TabsContent value="unpaid" className="space-y-4">
					<DataTable
						columns={columns(handlePayFine)}
						data={filteredFines}
						loading={loading}
					/>
				</TabsContent>

				<TabsContent value="paid" className="space-y-4">
					<DataTable
						columns={columns(handlePayFine)}
						data={filteredFines}
						loading={loading}
					/>
				</TabsContent>
			</Tabs>

			{/* Dialogs */}
			<CreateFineDialog
				open={showCreateDialog}
				onOpenChange={setShowCreateDialog}
				onSuccess={handleFineCreated}
			/>

			<PayFineDialog
				open={showPayDialog}
				onOpenChange={setShowPayDialog}
				fine={selectedFine}
				onSuccess={handleFinePaid}
			/>
		</div>
	);
}
