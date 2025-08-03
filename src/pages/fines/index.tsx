import { finesApi } from '@/apis/fines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FineStatistics, FineWithBorrowDetails } from '@/types';
import { Download, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { columns } from './components/columns';
import { CreateFineDialog } from './components/create-fine-dialog';
import { FineStatisticsCards } from './components/fine-statistics-cards';
import { PayFineDialog } from './components/pay-fine-dialog';

export default function FinesPage() {
	const [fines, setFines] = useState<FineWithBorrowDetails[]>([]);
	const [statistics, setStatistics] = useState<FineStatistics | null>(null);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<'all' | 'unpaid' | 'paid'>(
		'all'
	);
	const [selectedFine, setSelectedFine] =
		useState<FineWithBorrowDetails | null>(null);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [showPayDialog, setShowPayDialog] = useState(false);

	useEffect(() => {
		loadFines();
		loadStatistics();
	}, [statusFilter]);

	const loadFines = async () => {
		try {
			setLoading(true);
			let response;

			if (statusFilter === 'unpaid') {
				response = await finesApi.getUnpaid();
			} else if (statusFilter === 'paid') {
				response = await finesApi.getPaid();
			} else {
				response = await finesApi.getAll();
			}

			setFines(response.data);
		} catch (error) {
			console.error('Error loading fines:', error);
		} finally {
			setLoading(false);
		}
	};

	const loadStatistics = async () => {
		try {
			const stats = await finesApi.getStatistics();
			setStatistics(stats);
		} catch (error) {
			console.error('Error loading statistics:', error);
		}
	};

	const handleSearch = async () => {
		if (!searchQuery.trim()) {
			loadFines();
			return;
		}

		try {
			setLoading(true);
			const response = await finesApi.search(searchQuery);
			setFines(response.data);
		} catch (error) {
			console.error('Error searching fines:', error);
		} finally {
			setLoading(false);
		}
	};

	const handlePayFine = (fine: FineWithBorrowDetails) => {
		setSelectedFine(fine);
		setShowPayDialog(true);
	};

	const handleFinePaid = () => {
		loadFines();
		loadStatistics();
		setShowPayDialog(false);
	};

	const handleFineCreated = () => {
		loadFines();
		loadStatistics();
		setShowCreateDialog(false);
	};

	const handleExport = async () => {
		try {
			const blob = await finesApi.exportReport();
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
		} catch (error) {
			console.error('Error exporting fines:', error);
		}
	};

	const filteredFines = fines.filter((fine) => {
		if (statusFilter === 'unpaid') return fine.status === 'unpaid';
		if (statusFilter === 'paid') return fine.status === 'paid';
		return true;
	});

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
					<Button variant="outline" onClick={handleExport}>
						<Download className="h-4 w-4 mr-2" />
						Xuất báo cáo
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
						<Button onClick={handleSearch}>
							<Search className="h-4 w-4 mr-2" />
							Tìm kiếm
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
