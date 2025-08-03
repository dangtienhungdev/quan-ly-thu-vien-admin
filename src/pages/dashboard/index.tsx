import { dashboardApi } from '@/apis/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DashboardStatistics } from '@/types';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AlertsPanel } from './components/alerts-panel';
import { BooksStats } from './components/books-stats';
import { BorrowsStats } from './components/borrows-stats';
import { FinesStats } from './components/fines-stats';
import { OverviewCards } from './components/overview-cards';
import { QuickReport } from './components/quick-report';
import { ReadersStats } from './components/readers-stats';
import { TrendsChart } from './components/trends-chart';

export default function DashboardPage() {
	const [stats, setStats] = useState<DashboardStatistics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		try {
			setLoading(true);
			const data = await dashboardApi.getStatistics();
			setStats(data);
			setError(null);
		} catch (err) {
			setError('Không thể tải dữ liệu dashboard');
			console.error('Dashboard load error:', err);
		} finally {
			setLoading(false);
		}
	};

	const handleRefresh = () => {
		loadDashboardData();
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
					<p className="mt-4 text-lg">Đang tải dữ liệu...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
					<h2 className="text-2xl font-bold mb-2">Lỗi tải dữ liệu</h2>
					<p className="text-muted-foreground mb-4">{error}</p>
					<Button onClick={handleRefresh}>Thử lại</Button>
				</div>
			</div>
		);
	}

	if (!stats) {
		return null;
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Bảng điều khiển</h1>
					<p className="text-muted-foreground">Tổng quan hoạt động thư viện</p>
				</div>
				<Button onClick={handleRefresh} variant="outline">
					<TrendingUp className="h-4 w-4 mr-2" />
					Làm mới
				</Button>
			</div>

			{/* Quick Report */}
			<QuickReport />

			{/* Overview Cards */}
			<OverviewCards overview={stats.overview} />

			{/* Main Content Tabs */}
			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList className="grid w-full grid-cols-6">
					<TabsTrigger value="overview">Tổng quan</TabsTrigger>
					<TabsTrigger value="books">Sách</TabsTrigger>
					<TabsTrigger value="readers">Độc giả</TabsTrigger>
					<TabsTrigger value="borrows">Mượn trả</TabsTrigger>
					<TabsTrigger value="fines">Phạt</TabsTrigger>
					<TabsTrigger value="trends">Xu hướng</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<TrendsChart data={stats.trends} />
						<AlertsPanel alerts={stats.alerts} />
					</div>
				</TabsContent>

				<TabsContent value="books" className="space-y-4">
					<BooksStats books={stats.books} />
				</TabsContent>

				<TabsContent value="readers" className="space-y-4">
					<ReadersStats readers={stats.readers} />
				</TabsContent>

				<TabsContent value="borrows" className="space-y-4">
					<BorrowsStats borrows={stats.borrows} />
				</TabsContent>

				<TabsContent value="fines" className="space-y-4">
					<FinesStats fines={stats.fines} />
				</TabsContent>

				<TabsContent value="trends" className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle>Xu hướng mượn sách</CardTitle>
							</CardHeader>
							<CardContent>
								<TrendsChart data={stats.trends} />
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Thống kê lưu trữ</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex justify-between">
										<span>Không gian vật lý:</span>
										<span>
											{stats.storage.usedPhysicalSpace} /{' '}
											{stats.storage.totalPhysicalSpace}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Không gian số:</span>
										<span>
											{stats.storage.usedDigitalSpace} /{' '}
											{stats.storage.totalDigitalSpace}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
