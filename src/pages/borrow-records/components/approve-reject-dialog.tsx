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
import type {
	ApproveBorrowRequest,
	RejectBorrowRequest,
} from '@/types/borrow-records';
import React, { useState } from 'react';

interface ApproveRejectDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	bookTitle?: string;
	readerName?: string;
	action: 'approve' | 'reject';
	onSubmit: (data: ApproveBorrowRequest | RejectBorrowRequest) => void;
	isLoading?: boolean;
}

export function ApproveRejectDialog({
	open,
	onOpenChange,
	bookTitle,
	readerName,
	action,
	onSubmit,
	isLoading = false,
}: ApproveRejectDialogProps) {
	const [formData, setFormData] = useState({
		notes: '',
		reason: '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (action === 'approve') {
			onSubmit({
				librarianId: 'current-librarian-id', // TODO: Get from auth context
				notes: formData.notes,
			} as ApproveBorrowRequest);
		} else {
			onSubmit({
				librarianId: 'current-librarian-id', // TODO: Get from auth context
				reason: formData.reason,
			} as RejectBorrowRequest);
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const resetForm = () => {
		setFormData({
			notes: '',
			reason: '',
		});
	};

	const handleCancel = () => {
		resetForm();
		onOpenChange(false);
	};

	const isApprove = action === 'approve';

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{isApprove
							? 'Phê duyệt Yêu cầu Mượn Sách'
							: 'Từ chối Yêu cầu Mượn Sách'}
					</DialogTitle>
					<DialogDescription>
						{isApprove
							? 'Xác nhận phê duyệt yêu cầu mượn sách cho độc giả'
							: 'Xác nhận từ chối yêu cầu mượn sách cho độc giả'}
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

					{/* Notes/Reason */}
					<div className="space-y-2">
						<Label htmlFor={isApprove ? 'notes' : 'reason'}>
							{isApprove ? 'Ghi chú phê duyệt' : 'Lý do từ chối *'}
						</Label>
						<Textarea
							id={isApprove ? 'notes' : 'reason'}
							value={isApprove ? formData.notes : formData.reason}
							onChange={(e) =>
								handleInputChange(
									isApprove ? 'notes' : 'reason',
									e.target.value
								)
							}
							placeholder={
								isApprove
									? 'Ghi chú về việc phê duyệt...'
									: 'Nhập lý do từ chối yêu cầu...'
							}
							rows={3}
							required={!isApprove}
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
						<Button
							type="submit"
							disabled={isLoading}
							variant={isApprove ? 'default' : 'destructive'}
						>
							{isLoading
								? 'Đang xử lý...'
								: isApprove
								? 'Xác nhận Phê duyệt'
								: 'Xác nhận Từ chối'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
