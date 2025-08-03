import { finesApi } from '@/apis/fines';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { FineWithBorrowDetails } from '@/types';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface PayFineDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	fine: FineWithBorrowDetails | null;
	onSuccess: () => void;
}

export function PayFineDialog({
	open,
	onOpenChange,
	fine,
	onSuccess,
}: PayFineDialogProps) {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		payment_method: 'cash',
		notes: '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!fine) return;

		try {
			setLoading(true);
			await finesApi.pay(fine.id, {
				payment_date: new Date().toISOString(),
				payment_method: formData.payment_method,
				notes: formData.notes,
			});

			toast.success('Thanh toán phạt thành công');
			setFormData({ payment_method: 'cash', notes: '' });
			onSuccess();
		} catch (error) {
			console.error('Error paying fine:', error);
			toast.error('Có lỗi xảy ra khi thanh toán');
		} finally {
			setLoading(false);
		}
	};

	if (!fine) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Thanh toán phạt</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Fine Information */}
					<div className="bg-gray-50 p-4 rounded-lg space-y-3">
						<h3 className="font-semibold">Thông tin phạt</h3>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-muted-foreground">Độc giả:</span>
								<div className="font-medium">
									{fine.borrow_record.reader.full_name}
								</div>
							</div>
							<div>
								<span className="text-muted-foreground">Sách:</span>
								<div className="font-medium">
									{fine.borrow_record.copy.book.title}
								</div>
							</div>
							<div>
								<span className="text-muted-foreground">Số tiền phạt:</span>
								<div className="font-bold text-lg text-red-600">
									{fine.fine_amount.toLocaleString()} VNĐ
								</div>
							</div>
							<div>
								<span className="text-muted-foreground">Lý do:</span>
								<div className="font-medium">{fine.reason}</div>
							</div>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="payment_method">Phương thức thanh toán</Label>
							<Select
								value={formData.payment_method}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, payment_method: value }))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Chọn phương thức thanh toán" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="cash">Tiền mặt</SelectItem>
									<SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
									<SelectItem value="card">Thẻ tín dụng</SelectItem>
									<SelectItem value="other">Khác</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="notes">Ghi chú</Label>
							<Textarea
								id="notes"
								value={formData.notes}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, notes: e.target.value }))
								}
								placeholder="Ghi chú về việc thanh toán (tùy chọn)"
								rows={3}
							/>
						</div>

						<div className="flex justify-end gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={loading}
							>
								Hủy
							</Button>
							<Button
								type="submit"
								disabled={loading}
								className="bg-green-600 hover:bg-green-700"
							>
								{loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
							</Button>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
