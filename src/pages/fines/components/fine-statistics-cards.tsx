import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FineStatistics } from '@/types';
import {
	AlertTriangle,
	CheckCircle,
	DollarSign,
	TrendingUp,
} from 'lucide-react';

interface FineStatisticsCardsProps {
	statistics: FineStatistics;
}

export function FineStatisticsCards({ statistics }: FineStatisticsCardsProps) {
	const cards = [
		{
			title: 'Tổng số phạt',
			value: statistics.total,
			icon: TrendingUp,
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
		},
		{
			title: 'Chưa thanh toán',
			value: statistics.unpaid,
			icon: AlertTriangle,
			color: 'text-red-600',
			bgColor: 'bg-red-50',
		},
		{
			title: 'Đã thanh toán',
			value: statistics.paid,
			icon: CheckCircle,
			color: 'text-green-600',
			bgColor: 'bg-green-50',
		},
		{
			title: 'Tổng tiền phạt',
			value: `${statistics.totalAmount.toLocaleString()} VNĐ`,
			icon: DollarSign,
			color: 'text-emerald-600',
			bgColor: 'bg-emerald-50',
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{cards.map((card, index) => {
				const IconComponent = card.icon;
				return (
					<Card key={index} className="hover:shadow-lg transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								{card.title}
							</CardTitle>
							<div className={`p-2 rounded-lg ${card.bgColor}`}>
								<IconComponent className={`h-4 w-4 ${card.color}`} />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{card.value}</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
