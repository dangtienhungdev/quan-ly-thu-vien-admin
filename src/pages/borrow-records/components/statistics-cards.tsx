import { AlertTriangle, BookOpen, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { BorrowRecordStats } from '@/types/borrow-records';

interface StatisticsCardsProps {
	stats: BorrowRecordStats | null;
	isLoading: boolean;
}

export function StatisticsCards({ stats, isLoading }: StatisticsCardsProps) {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				{Array.from({ length: 5 }).map((_, index) => (
					<Card key={index} className="animate-pulse">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								<div className="h-4 bg-gray-200 rounded w-20"></div>
							</CardTitle>
							<div className="h-4 w-4 bg-gray-200 rounded"></div>
						</CardHeader>
						<CardContent>
							<div className="h-8 bg-gray-200 rounded w-12"></div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (!stats) {
		return null;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
			{/* Chờ phê duyệt */}
			{/* <Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Chờ phê duyệt</CardTitle>
					<Clock className="h-4 w-4 text-yellow-600" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.pending_approval}</div>
					<p className="text-xs text-muted-foreground">
						Yêu cầu mượn sách chờ xử lý
					</p>
				</CardContent>
			</Card> */}

			{/* Đang mượn */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Đang mượn</CardTitle>
					<BookOpen className="h-4 w-4 text-blue-600" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.borrowed}</div>
					<p className="text-xs text-muted-foreground">Sách đang được mượn</p>
				</CardContent>
			</Card>

			{/* Đã trả */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Đã trả</CardTitle>
					<CheckCircle className="h-4 w-4 text-green-600" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.returned}</div>
					<p className="text-xs text-muted-foreground">Sách đã được trả</p>
				</CardContent>
			</Card>

			{/* Đã gia hạn */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Đã gia hạn</CardTitle>
					<Calendar className="h-4 w-4 text-purple-600" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.renewed}</div>
					<p className="text-xs text-muted-foreground">
						Yêu cầu đã được gia hạn
					</p>
				</CardContent>
			</Card>

			{/* Quá hạn */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
					<AlertTriangle className="h-4 w-4 text-red-600" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.overdue}</div>
					<p className="text-xs text-muted-foreground">Sách mượn quá hạn</p>
				</CardContent>
			</Card>
		</div>
	);
}
