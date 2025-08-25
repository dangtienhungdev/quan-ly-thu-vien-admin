import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { FineStatus, FineType } from '@/types/fines';
import React, { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateFine } from '@/hooks/fines/use-create-fine';

interface CreateFineDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export function CreateFineDialog({
	open,
	onOpenChange,
	onSuccess,
}: CreateFineDialogProps) {
	const [formData, setFormData] = useState({
		borrow_id: '',
		fine_amount: '',
		reason: '',
		description: '',
	});

	// Sử dụng TanStack Query hook
	const { createFine, isCreating } = useCreateFine({
		onSuccess: () => {
			// Reset form sau khi tạo thành công
			setFormData({
				borrow_id: '',
				fine_amount: '',
				reason: '',
				description: '',
			});
			onSuccess();
			onOpenChange(false);
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.borrow_id || !formData.fine_amount || !formData.reason) {
			return; // Validation sẽ được xử lý bởi hook
		}

		// Map reason từ UI sang FineType enum
		const getFineType = (reason: string): FineType => {
			switch (reason) {
				case 'Trả sách muộn':
					return FineType.OVERDUE;
				case 'Sách bị hư hỏng':
					return FineType.DAMAGE;
				case 'Sách bị mất':
					return FineType.LOST;
				case 'Vi phạm quy định':
				case 'Khác':
					return FineType.ADMINISTRATIVE;
				default:
					return FineType.OVERDUE;
			}
		};

		const fineData = {
			borrow_id: formData.borrow_id,
			fine_amount: parseFloat(formData.fine_amount),
			fine_date: new Date().toISOString(),
			reason: getFineType(formData.reason),
			description: formData.description || formData.reason,
			status: FineStatus.UNPAID,
		};

		createFine(fineData);
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Tạo phạt mới</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="borrow_id">ID Lần mượn</Label>
						<Input
							id="borrow_id"
							value={formData.borrow_id}
							onChange={(e) => handleInputChange('borrow_id', e.target.value)}
							placeholder="Nhập ID lần mượn"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="fine_amount">Số tiền phạt (VNĐ)</Label>
						<Input
							id="fine_amount"
							type="number"
							value={formData.fine_amount}
							onChange={(e) => handleInputChange('fine_amount', e.target.value)}
							placeholder="Nhập số tiền phạt"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="reason">Lý do phạt</Label>
						<Select
							value={formData.reason}
							onValueChange={(value) => handleInputChange('reason', value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Chọn lý do phạt" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Trả sách muộn">Trả sách muộn</SelectItem>
								<SelectItem value="Sách bị hư hỏng">Sách bị hư hỏng</SelectItem>
								<SelectItem value="Sách bị mất">Sách bị mất</SelectItem>
								<SelectItem value="Vi phạm quy định">
									Vi phạm quy định
								</SelectItem>
								<SelectItem value="Khác">Khác</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{formData.reason === 'Khác' && (
						<div className="space-y-2">
							<Label htmlFor="custom_reason">Lý do khác</Label>
							<Textarea
								id="custom_reason"
								value={formData.description}
								onChange={(e) =>
									handleInputChange('description', e.target.value)
								}
								placeholder="Nhập lý do phạt"
								required
							/>
						</div>
					)}

					<div className="flex justify-end gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isCreating}
						>
							Hủy
						</Button>
						<Button type="submit" disabled={isCreating}>
							{isCreating ? 'Đang tạo...' : 'Tạo phạt'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
