import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ReturnBookRequest } from '@/types';
import React, { useState } from 'react';

interface ReturnBookDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	recordId: string;
	bookTitle?: string;
	readerName?: string;
	onSubmit: (data: ReturnBookRequest) => void;
	isLoading?: boolean;
}

export function ReturnBookDialog({
	open,
	onOpenChange,
	recordId,
	bookTitle,
	readerName,
	onSubmit,
	isLoading = false,
}: ReturnBookDialogProps) {
	const [formData, setFormData] = useState({
		returnNotes: '',
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
			returnNotes: '',
		});
	};

	const handleCancel = () => {
		resetForm();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Trả Sách</DialogTitle>
					<DialogDescription>Xác nhận trả sách cho độc giả</DialogDescription>
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

					{/* Return Notes */}
					<div className="space-y-2">
						<Label htmlFor="returnNotes">Ghi chú trả sách</Label>
						<Textarea
							id="returnNotes"
							value={formData.returnNotes}
							onChange={(e) => handleInputChange('returnNotes', e.target.value)}
							placeholder="Ghi chú về việc trả sách..."
							rows={3}
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
							{isLoading ? 'Đang xử lý...' : 'Xác nhận Trả sách'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
