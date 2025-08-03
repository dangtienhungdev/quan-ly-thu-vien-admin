import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface TrendsChartProps {
	data: {
		dailyBorrows: Array<{
			date: string;
			count: number;
		}>;
		monthlyBorrows: Array<{
			month: string;
			count: number;
		}>;
		dailyReturns: Array<{
			date: string;
			count: number;
		}>;
		dailyFines: Array<{
			date: string;
			amount: number;
		}>;
	};
}

export function TrendsChart({ data }: TrendsChartProps) {
	// Format data for charts
	const borrowsData = data.dailyBorrows.slice(-7).map((item) => ({
		date: new Date(item.date).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
		}),
		borrows: item.count,
	}));

	const returnsData = data.dailyReturns.slice(-7).map((item) => ({
		date: new Date(item.date).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
		}),
		returns: item.count,
	}));

	const finesData = data.dailyFines.slice(-7).map((item) => ({
		date: new Date(item.date).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
		}),
		fines: item.amount,
	}));

	const monthlyData = data.monthlyBorrows.slice(-6).map((item) => ({
		month: item.month,
		borrows: item.count,
	}));

	return (
		<div className="space-y-6">
			{/* Daily Borrows Chart */}
			<Card>
				<CardHeader>
					<CardTitle>Mượn sách theo ngày (7 ngày gần nhất)</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={borrowsData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="borrows"
								stroke="#3b82f6"
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Daily Returns Chart */}
			<Card>
				<CardHeader>
					<CardTitle>Trả sách theo ngày (7 ngày gần nhất)</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={returnsData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="returns"
								stroke="#10b981"
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Monthly Borrows Chart */}
			<Card>
				<CardHeader>
					<CardTitle>Mượn sách theo tháng (6 tháng gần nhất)</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={monthlyData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis />
							<Tooltip />
							<Bar dataKey="borrows" fill="#3b82f6" />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Daily Fines Chart */}
			<Card>
				<CardHeader>
					<CardTitle>Phạt theo ngày (7 ngày gần nhất)</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={finesData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip
								formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Phạt']}
							/>
							<Line
								type="monotone"
								dataKey="fines"
								stroke="#ef4444"
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</div>
	);
}
