import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, BookOpen, Clock } from 'lucide-react';

interface AlertsPanelProps {
	alerts: {
		overdueBooks: Array<{
			id: string;
			readerName: string;
			bookTitle: string;
			daysOverdue: number;
		}>;
		expiringCards: Array<{
			id: string;
			readerName: string;
			cardNumber: string;
			expiryDate: string;
		}>;
		lowStockBooks: Array<{
			id: string;
			title: string;
			availableCopies: number;
			minThreshold: number;
		}>;
		damagedBooks: Array<{
			id: string;
			title: string;
			damageCount: number;
		}>;
	};
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
	const totalAlerts =
		alerts.overdueBooks.length +
		alerts.expiringCards.length +
		alerts.lowStockBooks.length +
		alerts.damagedBooks.length;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Cảnh báo</CardTitle>
					<Badge variant={totalAlerts > 0 ? 'destructive' : 'secondary'}>
						{totalAlerts} cảnh báo
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Overdue Books */}
				{alerts.overdueBooks.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-4 w-4 text-orange-600" />
							<h4 className="font-medium">
								Sách quá hạn ({alerts.overdueBooks.length})
							</h4>
						</div>
						<div className="space-y-1">
							{alerts.overdueBooks.slice(0, 3).map((book) => (
								<div
									key={book.id}
									className="flex items-center justify-between text-sm p-2 bg-orange-50 rounded"
								>
									<div>
										<div className="font-medium">{book.bookTitle}</div>
										<div className="text-muted-foreground">
											{book.readerName}
										</div>
									</div>
									<Badge variant="destructive">{book.daysOverdue} ngày</Badge>
								</div>
							))}
							{alerts.overdueBooks.length > 3 && (
								<div className="text-sm text-muted-foreground">
									Và {alerts.overdueBooks.length - 3} sách khác...
								</div>
							)}
						</div>
					</div>
				)}

				{/* Expiring Cards */}
				{alerts.expiringCards.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-yellow-600" />
							<h4 className="font-medium">
								Thẻ sắp hết hạn ({alerts.expiringCards.length})
							</h4>
						</div>
						<div className="space-y-1">
							{alerts.expiringCards.slice(0, 3).map((card) => (
								<div
									key={card.id}
									className="flex items-center justify-between text-sm p-2 bg-yellow-50 rounded"
								>
									<div>
										<div className="font-medium">{card.readerName}</div>
										<div className="text-muted-foreground">
											{card.cardNumber}
										</div>
									</div>
									<Badge variant="secondary">
										{new Date(card.expiryDate).toLocaleDateString('vi-VN')}
									</Badge>
								</div>
							))}
							{alerts.expiringCards.length > 3 && (
								<div className="text-sm text-muted-foreground">
									Và {alerts.expiringCards.length - 3} thẻ khác...
								</div>
							)}
						</div>
					</div>
				)}

				{/* Low Stock Books */}
				{alerts.lowStockBooks.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<BookOpen className="h-4 w-4 text-red-600" />
							<h4 className="font-medium">
								Sách sắp hết ({alerts.lowStockBooks.length})
							</h4>
						</div>
						<div className="space-y-1">
							{alerts.lowStockBooks.slice(0, 3).map((book) => (
								<div
									key={book.id}
									className="flex items-center justify-between text-sm p-2 bg-red-50 rounded"
								>
									<div className="font-medium">{book.title}</div>
									<Badge variant="destructive">
										{book.availableCopies}/{book.minThreshold}
									</Badge>
								</div>
							))}
							{alerts.lowStockBooks.length > 3 && (
								<div className="text-sm text-muted-foreground">
									Và {alerts.lowStockBooks.length - 3} sách khác...
								</div>
							)}
						</div>
					</div>
				)}

				{/* Damaged Books */}
				{alerts.damagedBooks.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-4 w-4 text-red-600" />
							<h4 className="font-medium">
								Sách hư hỏng ({alerts.damagedBooks.length})
							</h4>
						</div>
						<div className="space-y-1">
							{alerts.damagedBooks.slice(0, 3).map((book) => (
								<div
									key={book.id}
									className="flex items-center justify-between text-sm p-2 bg-red-50 rounded"
								>
									<div className="font-medium">{book.title}</div>
									<Badge variant="destructive">{book.damageCount} cuốn</Badge>
								</div>
							))}
							{alerts.damagedBooks.length > 3 && (
								<div className="text-sm text-muted-foreground">
									Và {alerts.damagedBooks.length - 3} sách khác...
								</div>
							)}
						</div>
					</div>
				)}

				{totalAlerts === 0 && (
					<div className="text-center py-8 text-muted-foreground">
						<AlertTriangle className="h-12 w-12 mx-auto mb-4 text-green-600" />
						<p>Không có cảnh báo nào</p>
						<p className="text-sm">Hệ thống đang hoạt động bình thường</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
