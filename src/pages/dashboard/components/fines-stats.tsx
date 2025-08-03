import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface FinesStatsProps {
	fines: {
		totalUnpaid: number;
		totalPaid: number;
		totalAmount: number;
		paidAmount: number;
		unpaidAmount: number;
		byReason: Array<{
			reason: string;
			count: number;
			amount: number;
		}>;
	};
}

export function FinesStats({ fines }: FinesStatsProps) {
	const stats = [
		{
			title: 'Chưa thanh toán',
			value: fines.totalUnpaid,
			amount: fines.unpaidAmount,
			icon: AlertTriangle,
			color: 'text-red-600',
			bgColor: 'bg-red-50',
		},
		{
			title: 'Đã thanh toán',
			value: fines.totalPaid,
			amount: fines.paidAmount,
			icon: CheckCircle,
			color: 'text-green-600',
			bgColor: 'bg-green-50',
		},
		{
			title: 'Tổng phạt',
			value: fines.totalAmount,
			amount: fines.totalAmount,
			icon: DollarSign,
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
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
								<div className="text-sm text-muted-foreground">
									{stat.amount.toLocaleString()} VNĐ
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Fines by Reason Chart */}
				<Card>
					<CardHeader>
						<CardTitle>Phạt theo lý do</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={fines.byReason}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="reason" />
								<YAxis />
								<Tooltip
									formatter={(value) => [value.toLocaleString(), 'Số lượng']}
								/>
								<Bar dataKey="count" fill="#3b82f6" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Fines Amount by Reason */}
				<Card>
					<CardHeader>
						<CardTitle>Số tiền phạt theo lý do</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={fines.byReason}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="reason" />
								<YAxis />
								<Tooltip
									formatter={(value) => [
										`${value.toLocaleString()} VNĐ`,
										'Số tiền',
									]}
								/>
								<Bar dataKey="amount" fill="#ef4444" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Fines Details */}
			<Card>
				<CardHeader>
					<CardTitle>Chi tiết phạt theo lý do</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{fines.byReason.map((reason, index) => (
							<div
								key={index}
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
										<div className="font-medium">{reason.reason}</div>
										<div className="text-sm text-muted-foreground">
											{reason.count} trường hợp
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="font-bold text-lg">
										{reason.amount.toLocaleString()} VNĐ
									</div>
									<div className="text-sm text-muted-foreground">
										Trung bình:{' '}
										{(reason.amount / reason.count).toLocaleString()} VNĐ
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
