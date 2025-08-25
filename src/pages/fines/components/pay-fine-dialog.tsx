import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import type { FineWithBorrowDetails } from '@/types/fines';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { usePayFine } from '@/hooks/fines/use-pay-fine';

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
	const [formData, setFormData] = useState({
		payment_method: 'cash',
		amount: 0,
		notes: '',
	});

	// Tự động điền số tiền phạt khi fine thay đổi
	useEffect(() => {
		if (fine) {
			setFormData((prev) => ({
				...prev,
				amount: fine.fine_amount,
			}));
		}
	}, [fine]);

	// Sử dụng TanStack Query hook
	const { payFine, isPaying } = usePayFine({
		onSuccess: () => {
			// Reset form sau khi thanh toán thành công
			setFormData({ payment_method: 'cash', amount: 0, notes: '' });
			onSuccess();
			onOpenChange(false);
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!fine) return;

		// Validation
		if (!formData.amount || formData.amount <= 0) {
			toast.error('Vui lòng nhập số tiền thanh toán hợp lệ');
			return;
		}

		if (formData.amount > fine.fine_amount) {
			toast.error('Số tiền thanh toán không được vượt quá số tiền phạt');
			return;
		}

		const paymentData = {
			amount: formData.amount,
			paymentMethod: formData.payment_method,
			transactionId: formData.notes ? `TXN_${Date.now()}` : undefined,
		};

		console.log('Payment data:', paymentData);
		payFine({ id: fine.id, data: paymentData });
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
									{fine.borrow_record?.reader?.fullName || 'Không có thông tin'}
								</div>
							</div>
							<div>
								<span className="text-muted-foreground">Sách:</span>
								<div className="font-medium">
									{fine.borrow_record?.copy?.book?.title || 'Không có tên sách'}
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
							<Label htmlFor="amount">Số tiền thanh toán</Label>
							<input
								type="number"
								id="amount"
								value={formData.amount}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										amount: Number(e.target.value),
									}))
								}
								placeholder="Nhập số tiền thanh toán"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								min="0"
								max={fine.fine_amount}
							/>
							<div className="text-sm text-muted-foreground">
								Số tiền phạt: {fine.fine_amount.toLocaleString()} VNĐ
							</div>
						</div>

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
									<SelectItem value="online">Thanh toán online</SelectItem>
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
								disabled={isPaying}
							>
								Hủy
							</Button>
							<Button
								type="submit"
								disabled={isPaying}
								className="bg-green-600 hover:bg-green-700"
							>
								{isPaying ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
							</Button>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
