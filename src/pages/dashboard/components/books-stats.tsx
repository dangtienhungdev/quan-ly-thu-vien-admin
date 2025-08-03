import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	AlertTriangle,
	BookOpen,
	CheckCircle,
	Clock,
	FileText,
} from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface BooksStatsProps {
	books: {
		totalPhysical: number;
		totalEbooks: number;
		availableCopies: number;
		borrowedCopies: number;
		reservedCopies: number;
		damagedCopies: number;
		popularBooks: Array<{
			id: string;
			title: string;
			borrowCount: number;
			isbn: string;
		}>;
	};
}

export function BooksStats({ books }: BooksStatsProps) {
	const pieData = [
		{ name: 'Sẵn sàng', value: books.availableCopies, color: '#10b981' },
		{ name: 'Đang mượn', value: books.borrowedCopies, color: '#3b82f6' },
		{ name: 'Đặt trước', value: books.reservedCopies, color: '#f59e0b' },
		{ name: 'Hư hỏng', value: books.damagedCopies, color: '#ef4444' },
	];

	const stats = [
		{
			title: 'Sách vật lý',
			value: books.totalPhysical,
			icon: BookOpen,
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
		},
		{
			title: 'Sách điện tử',
			value: books.totalEbooks,
			icon: FileText,
			color: 'text-green-600',
			bgColor: 'bg-green-50',
		},
		{
			title: 'Sẵn sàng mượn',
			value: books.availableCopies,
			icon: CheckCircle,
			color: 'text-emerald-600',
			bgColor: 'bg-emerald-50',
		},
		{
			title: 'Đang được mượn',
			value: books.borrowedCopies,
			icon: Clock,
			color: 'text-orange-600',
			bgColor: 'bg-orange-50',
		},
		{
			title: 'Đã đặt trước',
			value: books.reservedCopies,
			icon: AlertTriangle,
			color: 'text-purple-600',
			bgColor: 'bg-purple-50',
		},
		{
			title: 'Hư hỏng',
			value: books.damagedCopies,
			icon: AlertTriangle,
			color: 'text-red-600',
			bgColor: 'bg-red-50',
		},
	];

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
						<CardTitle>Phân bố trạng thái sách</CardTitle>
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

				{/* Popular Books */}
				<Card>
					<CardHeader>
						<CardTitle>Sách phổ biến</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{books.popularBooks.map((book, index) => (
								<div
									key={book.id}
									className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
								>
									<div className="flex items-center gap-3">
										<Badge
											variant="secondary"
											className="w-8 h-8 flex items-center justify-center"
										>
											{index + 1}
										</Badge>
										<div>
											<div className="font-medium">{book.title}</div>
											<div className="text-sm text-muted-foreground">
												ISBN: {book.isbn}
											</div>
										</div>
									</div>
									<Badge variant="outline">{book.borrowCount} lượt mượn</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
