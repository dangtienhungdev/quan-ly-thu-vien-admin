import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	AlertTriangle,
	BookOpen,
	Calendar,
	CheckCircle,
	Clock,
} from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface BorrowsStatsProps {
	borrows: {
		totalActive: number;
		totalOverdue: number;
		totalReturned: number;
		byStatus: Array<{
			status: string;
			count: number;
		}>;
		recentBorrows: Array<{
			id: string;
			readerName: string;
			bookTitle: string;
			borrowDate: string;
			dueDate: string;
		}>;
	};
}

export function BorrowsStats({ borrows }: BorrowsStatsProps) {
	const pieData = [
		{ name: 'Đang mượn', value: borrows.totalActive, color: '#3b82f6' },
		{ name: 'Quá hạn', value: borrows.totalOverdue, color: '#ef4444' },
		{ name: 'Đã trả', value: borrows.totalReturned, color: '#10b981' },
	];

	const stats = [
		{
			title: 'Đang mượn',
			value: borrows.totalActive,
			icon: BookOpen,
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
		},
		{
			title: 'Quá hạn',
			value: borrows.totalOverdue,
			icon: AlertTriangle,
			color: 'text-red-600',
			bgColor: 'bg-red-50',
		},
		{
			title: 'Đã trả',
			value: borrows.totalReturned,
			icon: CheckCircle,
			color: 'text-green-600',
			bgColor: 'bg-green-50',
		},
	];

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{stats.map((stat, index) => {
					const IconComponent = stat.icon;
					return (
						<Card key={index}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									{stat.title}
								</CardTitle>
								<div className={`p-2 rounded-lg ${stat.bgColor}`}>
									<IconComponent className={`h-4 w-4 ${stat.color}`} />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{stat.value.toLocaleString()}
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Pie Chart */}
				<Card>
					<CardHeader>
						<CardTitle>Phân bố trạng thái mượn sách</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={pieData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) =>
										`${name} ${((percent || 0) * 100).toFixed(0)}%`
									}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
								>
									{pieData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Recent Borrows */}
				<Card>
					<CardHeader>
						<CardTitle>Mượn sách gần đây</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{borrows.recentBorrows.map((borrow) => (
								<div
									key={borrow.id}
									className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
								>
									<div className="flex-1">
										<div className="font-medium">{borrow.bookTitle}</div>
										<div className="text-sm text-muted-foreground">
											{borrow.readerName}
										</div>
										<div className="flex items-center gap-4 mt-1">
											<div className="flex items-center gap-1 text-xs text-muted-foreground">
												<Calendar className="h-3 w-3" />
												{new Date(borrow.borrowDate).toLocaleDateString(
													'vi-VN'
												)}
											</div>
											<div className="flex items-center gap-1 text-xs text-muted-foreground">
												<Clock className="h-3 w-3" />
												{new Date(borrow.dueDate).toLocaleDateString('vi-VN')}
											</div>
										</div>
									</div>
									<Badge variant="outline">Đang mượn</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
