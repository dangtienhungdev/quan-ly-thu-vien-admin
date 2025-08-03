import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Clock, UserCheck, UserX } from 'lucide-react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface ReadersStatsProps {
	readers: {
		totalActive: number;
		totalSuspended: number;
		totalExpired: number;
		byType: Array<{
			type: string;
			count: number;
		}>;
		topReaders: Array<{
			id: string;
			fullName: string;
			borrowCount: number;
			cardNumber: string;
		}>;
	};
}

export function ReadersStats({ readers }: ReadersStatsProps) {
	const stats = [
		{
			title: 'Độc giả hoạt động',
			value: readers.totalActive,
			icon: UserCheck,
			color: 'text-green-600',
			bgColor: 'bg-green-50',
		},
		{
			title: 'Độc giả bị đình chỉ',
			value: readers.totalSuspended,
			icon: UserX,
			color: 'text-red-600',
			bgColor: 'bg-red-50',
		},
		{
			title: 'Thẻ hết hạn',
			value: readers.totalExpired,
			icon: Clock,
			color: 'text-orange-600',
			bgColor: 'bg-orange-50',
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
				{/* Readers by Type Chart */}
				<Card>
					<CardHeader>
						<CardTitle>Độc giả theo loại</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={readers.byType}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="type" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="count" fill="#3b82f6" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Top Readers */}
				<Card>
					<CardHeader>
						<CardTitle>Độc giả tích cực</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{readers.topReaders.map((reader, index) => (
								<div
									key={reader.id}
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
											<div className="font-medium">{reader.fullName}</div>
											<div className="text-sm text-muted-foreground">
												{reader.cardNumber}
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Award className="h-4 w-4 text-yellow-600" />
										<Badge variant="outline">
											{reader.borrowCount} lượt mượn
										</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
