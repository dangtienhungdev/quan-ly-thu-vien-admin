import { dashboardApi } from '@/apis/dashboard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	AlertTriangle,
	BookOpen,
	Calendar,
	Clock,
	DollarSign,
	Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function QuickReport() {
	const [report, setReport] = useState<{
		totalBorrowsToday: number;
		totalReturnsToday: number;
		totalFinesToday: number;
		overdueBooksCount: number;
		newReadersToday: number;
		newBooksToday: number;
	} | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadQuickReport();
	}, []);

	const loadQuickReport = async () => {
		try {
			setLoading(true);
			const data = await dashboardApi.getQuickReport();
			setReport(data);
		} catch (error) {
			console.error('Error loading quick report:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Báo cáo hôm nay</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="animate-pulse space-y-4">
						<div className="h-4 bg-gray-200 rounded w-3/4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2"></div>
						<div className="h-4 bg-gray-200 rounded w-2/3"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!report) {
		return null;
	}

	const items = [
		{
			title: 'Mượn sách hôm nay',
			value: report.totalBorrowsToday,
			icon: BookOpen,
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
		},
		{
			title: 'Trả sách hôm nay',
			value: report.totalReturnsToday,
			icon: Calendar,
			color: 'text-green-600',
			bgColor: 'bg-green-50',
		},
		{
			title: 'Phạt hôm nay',
			value: report.totalFinesToday,
			icon: DollarSign,
			color: 'text-red-600',
			bgColor: 'bg-red-50',
		},
		{
			title: 'Sách quá hạn',
			value: report.overdueBooksCount,
			icon: AlertTriangle,
			color: 'text-orange-600',
			bgColor: 'bg-orange-50',
		},
		{
			title: 'Độc giả mới',
			value: report.newReadersToday,
			icon: Users,
			color: 'text-purple-600',
			bgColor: 'bg-purple-50',
		},
		{
			title: 'Sách mới',
			value: report.newBooksToday,
			icon: BookOpen,
			color: 'text-emerald-600',
			bgColor: 'bg-emerald-50',
		},
	];

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Báo cáo hôm nay</CardTitle>
					<Badge variant="secondary">
						<Clock className="h-3 w-3 mr-1" />
						{new Date().toLocaleDateString('vi-VN')}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
					{items.map((item, index) => {
						const IconComponent = item.icon;
						return (
							<div key={index} className="text-center">
								<div
									className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${item.bgColor} mb-2`}
								>
									<IconComponent className={`h-6 w-6 ${item.color}`} />
								</div>
								<div className="text-2xl font-bold">{item.value}</div>
								<div className="text-sm text-muted-foreground">
									{item.title}
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
