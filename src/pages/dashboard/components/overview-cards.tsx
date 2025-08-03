import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	AlertTriangle,
	BookOpen,
	Calendar,
	DollarSign,
	TrendingUp,
	Users,
} from 'lucide-react';

interface OverviewCardsProps {
	overview: {
		totalBooks: number;
		totalReaders: number;
		totalBorrows: number;
		totalReservations: number;
		totalFines: number;
		totalRevenue: number;
	};
}

export function OverviewCards({ overview }: OverviewCardsProps) {
	const cards = [
		{
			title: 'Tổng số sách',
			value: overview.totalBooks.toLocaleString(),
			icon: BookOpen,
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
		},
		{
			title: 'Tổng độc giả',
			value: overview.totalReaders.toLocaleString(),
			icon: Users,
			color: 'text-green-600',
			bgColor: 'bg-green-50',
		},
		{
			title: 'Lượt mượn',
			value: overview.totalBorrows.toLocaleString(),
			icon: Calendar,
			color: 'text-purple-600',
			bgColor: 'bg-purple-50',
		},
		{
			title: 'Đặt trước',
			value: overview.totalReservations.toLocaleString(),
			icon: TrendingUp,
			color: 'text-orange-600',
			bgColor: 'bg-orange-50',
		},
		{
			title: 'Tổng phạt',
			value: overview.totalFines.toLocaleString(),
			icon: AlertTriangle,
			color: 'text-red-600',
			bgColor: 'bg-red-50',
		},
		{
			title: 'Doanh thu',
			value: `${overview.totalRevenue.toLocaleString()} VNĐ`,
			icon: DollarSign,
			color: 'text-emerald-600',
			bgColor: 'bg-emerald-50',
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
