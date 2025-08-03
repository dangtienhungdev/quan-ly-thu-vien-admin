import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RenewBookRequest } from '@/types';
import React, { useState } from 'react';

interface RenewBookDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	bookTitle?: string;
	readerName?: string;
	currentDueDate?: string;
	onSubmit: (data: RenewBookRequest) => void;
	isLoading?: boolean;
}

export function RenewBookDialog({
	open,
	onOpenChange,
	bookTitle,
	readerName,
	currentDueDate,
	onSubmit,
	isLoading = false,
}: RenewBookDialogProps) {
	const [formData, setFormData] = useState({
		newDueDate: currentDueDate
			? new Date(new Date(currentDueDate).getTime() + 14 * 24 * 60 * 60 * 1000)
					.toISOString()
					.split('T')[0]
			: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)
					.toISOString()
					.split('T')[0],
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const resetForm = () => {
		setFormData({
			newDueDate: currentDueDate
				? new Date(
						new Date(currentDueDate).getTime() + 14 * 24 * 60 * 60 * 1000
				  )
						.toISOString()
						.split('T')[0]
				: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)
						.toISOString()
						.split('T')[0],
		});
	};

	const handleCancel = () => {
		resetForm();
		onOpenChange(false);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN');
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Gia hạn Sách</DialogTitle>
					<DialogDescription>
						Gia hạn thời gian mượn sách cho độc giả
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Book and Reader Info */}
					<div className="space-y-2">
						<Label>Sách</Label>
						<p className="text-sm text-muted-foreground">
							{bookTitle || 'Không có thông tin'}
						</p>
					</div>

					<div className="space-y-2">
						<Label>Độc giả</Label>
						<p className="text-sm text-muted-foreground">
							{readerName || 'Không có thông tin'}
						</p>
					</div>

					{/* Current Due Date */}
					<div className="space-y-2">
						<Label>Hạn trả hiện tại</Label>
						<p className="text-sm text-muted-foreground">
							{currentDueDate
								? formatDate(currentDueDate)
								: 'Không có thông tin'}
						</p>
					</div>

					{/* New Due Date */}
					<div className="space-y-2">
						<Label htmlFor="newDueDate">Hạn trả mới *</Label>
						<Input
							id="newDueDate"
							type="date"
							value={formData.newDueDate}
							onChange={(e) => handleInputChange('newDueDate', e.target.value)}
							required
						/>
					</div>

					<div className="flex justify-end space-x-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={isLoading}
						>
							Hủy
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? 'Đang xử lý...' : 'Xác nhận Gia hạn'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
