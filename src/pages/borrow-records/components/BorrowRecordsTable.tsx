import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	AlertTriangle,
	Bell,
	BookOpen,
	Calendar,
	CheckCircle,
	Eye,
	ThumbsUp,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BorrowStatus } from '@/types/borrow-records';

interface BorrowRecordsTableProps {
	records: any[];
	isLoading: boolean;
	onViewDetails: (record: any) => void;
	onApprove: (record: any) => void;
	onReturn: (record: any) => void;
	onRenew: (record: any) => void;
	onSendNotification: (record: any) => void;
	onDelete: (record: any) => void;
	isApproving: boolean;
	isReturning: boolean;
	isRenewing: boolean;
	isSendingReminders: boolean;
	isDeleting: boolean;
	shouldDisableApproveButton: (record: any) => boolean;
	approvedBooks: Record<string, boolean>;
}

export const BorrowRecordsTable: React.FC<BorrowRecordsTableProps> = ({
	records,
	isLoading,
	onViewDetails,
	onApprove,
	onReturn,
	onRenew,
	onSendNotification,
	onDelete,
	isApproving,
	isReturning,
	isRenewing,
	isSendingReminders,
	isDeleting,
	shouldDisableApproveButton,
	approvedBooks,
}) => {
	const getStatusColor = (status: BorrowStatus) => {
		const colors: Record<BorrowStatus, string> = {
			pending_approval: 'bg-yellow-100 text-yellow-800',
			borrowed: 'bg-blue-100 text-blue-800',
			returned: 'bg-green-100 text-green-800',
			overdue: 'bg-red-100 text-red-800',
			renewed: 'bg-purple-100 text-purple-800',
		};
		return colors[status];
	};

	const getStatusIcon = (status: BorrowStatus) => {
		switch (status) {
			case 'pending_approval':
				return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
			case 'borrowed':
				return <BookOpen className="h-4 w-4 text-blue-600" />;
			case 'returned':
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case 'overdue':
				return <AlertTriangle className="h-4 w-4 text-red-600" />;
			case 'renewed':
				return <Calendar className="h-4 w-4 text-purple-600" />;
			default:
				return null;
		}
	};

	const getStatusText = (status: BorrowStatus) => {
		const texts: Record<BorrowStatus, string> = {
			pending_approval: 'Chờ phê duyệt',
			borrowed: 'Đang mượn',
			returned: 'Đã trả',
			overdue: 'Quá hạn',
			renewed: 'Đã gia hạn',
		};
		return texts[status];
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('vi-VN');
	};

	const calculateDaysOverdue = (dueDate: string) => {
		const due = new Date(dueDate);
		const today = new Date();
		const diffTime = today.getTime() - due.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	};

	const calculateDaysUntilDue = (dueDate: string) => {
		const due = new Date(dueDate);
		const today = new Date();
		const diffTime = due.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	};

	const isDueWithin3Days = (dueDate: string) => {
		const daysUntilDue = calculateDaysUntilDue(dueDate);
		return daysUntilDue <= 3 && daysUntilDue > 0;
	};

	const renderBorrowRecordRow = (record: any) => {
		return (
			<TableRow key={record.id}>
				<TableCell className="font-medium">
					{record.physicalCopy?.book?.title || 'Không có tên sách'}
				</TableCell>
				<TableCell>
					{record.reader?.fullName || 'Không có tên độc giả'}
					<br />
					<span className="text-sm text-muted-foreground">
						{record.reader?.cardNumber || 'Không có mã thẻ'}
					</span>
				</TableCell>
				<TableCell>{formatDate(record.borrow_date)}</TableCell>
				<TableCell>{formatDate(record.due_date)}</TableCell>
				<TableCell>
					<Badge className={getStatusColor(record.status)}>
						{getStatusIcon(record.status)}
						<span className="ml-1">{getStatusText(record.status)}</span>
					</Badge>
				</TableCell>
				<TableCell>
					{record.status === 'overdue' && (
						<span className="text-red-600 font-medium">
							{calculateDaysOverdue(record.due_date)} ngày
						</span>
					)}
					{record.status === 'borrowed' && (
						<span className="text-blue-600 font-medium">
							{calculateDaysUntilDue(record.due_date)} ngày
						</span>
					)}
					{record.status === 'returned' && record.return_date && (
						<span className="text-green-600">
							{formatDate(record.return_date)}
						</span>
					)}
				</TableCell>
				<TableCell>{formatDate(record.return_date)}</TableCell>
				<TableCell>
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onViewDetails(record)}
							title="Xem chi tiết"
						>
							<Eye className="h-4 w-4" />
						</Button>

						{/* Actions for pending approval */}
						{record.status === 'pending_approval' &&
							record.physicalCopy?.status === 'available' && (
								<>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onApprove(record)}
										title={
											shouldDisableApproveButton(record)
												? approvedBooks[record.physicalCopy?.book?.id]
													? 'Không thể phê duyệt - sách đã được phê duyệt cho người khác'
													: 'Không thể phê duyệt - có đặt trước chờ xử lý'
												: 'Phê duyệt'
										}
										disabled={isApproving || shouldDisableApproveButton(record)}
									>
										<ThumbsUp
											className={`h-4 w-4 ${
												shouldDisableApproveButton(record)
													? 'text-gray-400'
													: 'text-green-600'
											}`}
										/>
									</Button>
								</>
							)}

						{/* Actions for borrowed books */}
						{record.status === 'borrowed' && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onReturn(record)}
									title="Trả sách"
									disabled={isReturning}
								>
									<CheckCircle className="h-4 w-4 text-green-600" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onRenew(record)}
									title="Gia hạn"
									disabled={isRenewing}
								>
									<Calendar className="h-4 w-4 text-blue-600" />
								</Button>
								{/* Notification button for books due within 3 days */}
								{isDueWithin3Days(record.due_date) && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onSendNotification(record)}
										title="Gửi thông báo nhắc nhở"
										className="text-orange-600 hover:text-orange-700"
										disabled={isSendingReminders}
									>
										<Bell className="h-4 w-4" />
									</Button>
								)}
							</>
						)}

						{/* Actions for overdue books */}
						{record.status === 'overdue' && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onReturn(record)}
									title="Trả sách"
									disabled={isReturning}
								>
									<CheckCircle className="h-4 w-4 text-green-600" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onRenew(record)}
									title="Gia hạn"
									disabled={isRenewing}
								>
									<Calendar className="h-4 w-4 text-blue-600" />
								</Button>
								{/* Notification button for overdue books */}
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onSendNotification(record)}
									title="Gửi thông báo nhắc nhở (Quá hạn)"
									className="text-red-600 hover:text-red-700"
									disabled={isSendingReminders}
								>
									<Bell className="h-4 w-4" />
								</Button>
							</>
						)}

						{/* đã gia hạn cũng sẽ có nút trả sách */}
						{record.status === 'renewed' && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onReturn(record)}
									title="Trả sách"
									disabled={isReturning}
								>
									<CheckCircle className="h-4 w-4 text-green-600" />
								</Button>
							</>
						)}
					</div>
				</TableCell>
			</TableRow>
		);
	};

	if (isLoading) {
		return <div className="text-center py-8">Đang tải...</div>;
	}

	if (records.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				Không có giao dịch mượn sách nào
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Sách</TableHead>
						<TableHead>Độc giả</TableHead>
						<TableHead>Ngày mượn</TableHead>
						<TableHead>Hạn trả</TableHead>
						<TableHead>Trạng thái</TableHead>
						<TableHead>Thời gian</TableHead>
						<TableHead>Ngày trả</TableHead>
						<TableHead>Hành động</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{records.map((record) => renderBorrowRecordRow(record))}
				</TableBody>
			</Table>
		</div>
	);
};
