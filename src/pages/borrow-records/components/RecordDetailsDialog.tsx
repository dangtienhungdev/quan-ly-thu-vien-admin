import { Button } from '@/components/ui/button';
import type { BorrowStatus } from '@/types/borrow-records';

interface RecordDetailsDialogProps {
	record: any;
	onClose: () => void;
}

export const RecordDetailsDialog: React.FC<RecordDetailsDialogProps> = ({
	record,
	onClose,
}) => {
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

	if (!record) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg w-full max-w-2xl">
				<h2 className="text-xl font-semibold mb-4">Chi tiết Giao dịch</h2>
				<div className="space-y-2">
					<p>
						<strong>Sách:</strong> {record.physicalCopy?.book?.title}
					</p>
					<p>
						<strong>Độc giả:</strong> {record.reader?.fullName}
					</p>
					<p>
						<strong>Mã thẻ:</strong> {record.reader?.cardNumber}
					</p>
					<p>
						<strong>Barcode sách:</strong> {record.physicalCopy?.barcode}
					</p>
					<p>
						<strong>Ngày mượn:</strong> {formatDate(record.borrow_date)}
					</p>
					<p>
						<strong>Hạn trả:</strong> {formatDate(record.due_date)}
					</p>
					<p>
						<strong>Trạng thái:</strong> {getStatusText(record.status)}
					</p>
					{record.return_date && (
						<p>
							<strong>Ngày trả:</strong> {formatDate(record.return_date)}
						</p>
					)}
					<p>
						<strong>Số lần gia hạn:</strong> {record.renewal_count}
					</p>
					{record.borrow_notes && (
						<p>
							<strong>Ghi chú mượn:</strong> {record.borrow_notes}
						</p>
					)}
					{record.return_notes && (
						<p>
							<strong>Ghi chú trả:</strong> {record.return_notes}
						</p>
					)}
				</div>
				<div className="flex justify-end space-x-2 mt-4">
					<Button variant="outline" onClick={onClose}>
						Đóng
					</Button>
				</div>
			</div>
		</div>
	);
};
