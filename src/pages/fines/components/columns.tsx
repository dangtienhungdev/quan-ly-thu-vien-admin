import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { FineWithBorrowDetails } from '@/types';
import { BookOpen, Calendar, DollarSign, User } from 'lucide-react';

export const columns = (onPayFine: (fine: FineWithBorrowDetails) => void) => [
	{
		key: 'reader',
		header: 'Độc giả',
		render: (fine: FineWithBorrowDetails) => (
			<div className="flex items-center gap-2">
				<User className="h-4 w-4 text-muted-foreground" />
				<div>
					<div className="font-medium">
						{fine.borrow_record.reader.full_name}
					</div>
					<div className="text-sm text-muted-foreground">
						{fine.borrow_record.reader.card_number}
					</div>
				</div>
			</div>
		),
	},
	{
		key: 'book',
		header: 'Sách',
		render: (fine: FineWithBorrowDetails) => (
			<div className="flex items-center gap-2">
				<BookOpen className="h-4 w-4 text-muted-foreground" />
				<div>
					<div className="font-medium">
						{fine.borrow_record.copy.book.title}
					</div>
					<div className="text-sm text-muted-foreground">
						{fine.borrow_record.copy.book.isbn}
					</div>
				</div>
			</div>
		),
	},
	{
		key: 'fine_amount',
		header: 'Số tiền phạt',
		render: (fine: FineWithBorrowDetails) => (
			<div className="flex items-center gap-2">
				<DollarSign className="h-4 w-4 text-muted-foreground" />
				<span className="font-bold text-lg">
					{fine.fine_amount.toLocaleString()} VNĐ
				</span>
			</div>
		),
	},
	{
		key: 'reason',
		header: 'Lý do',
		render: (fine: FineWithBorrowDetails) => (
			<div className="max-w-xs">
				<span className="text-sm">{fine.reason}</span>
			</div>
		),
	},
	{
		key: 'fine_date',
		header: 'Ngày phạt',
		render: (fine: FineWithBorrowDetails) => (
			<div className="flex items-center gap-2">
				<Calendar className="h-4 w-4 text-muted-foreground" />
				<span className="text-sm">
					{new Date(fine.fine_date).toLocaleDateString('vi-VN')}
				</span>
			</div>
		),
	},
	{
		key: 'status',
		header: 'Trạng thái',
		render: (fine: FineWithBorrowDetails) => (
			<Badge variant={fine.status === 'paid' ? 'default' : 'destructive'}>
				{fine.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
			</Badge>
		),
	},
	{
		key: 'payment_date',
		header: 'Ngày thanh toán',
		render: (fine: FineWithBorrowDetails) => (
			<div className="flex items-center gap-2">
				<Calendar className="h-4 w-4 text-muted-foreground" />
				<span className="text-sm">
					{fine.payment_date
						? new Date(fine.payment_date).toLocaleDateString('vi-VN')
						: 'Chưa thanh toán'}
				</span>
			</div>
		),
	},
	{
		key: 'actions',
		header: 'Thao tác',
		render: (fine: FineWithBorrowDetails) => (
			<div className="flex items-center gap-2">
				{fine.status === 'unpaid' && (
					<Button
						size="sm"
						onClick={() => onPayFine(fine)}
						className="bg-green-600 hover:bg-green-700"
					>
						<DollarSign className="h-4 w-4 mr-1" />
						Thanh toán
					</Button>
				)}
			</div>
		),
	},
];
