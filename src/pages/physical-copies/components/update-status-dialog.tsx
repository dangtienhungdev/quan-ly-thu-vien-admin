import type { CopyStatus, PhysicalCopy } from '@/types';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { memo } from 'react';

interface UpdateStatusDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	physicalCopy: PhysicalCopy | null;
	onUpdateStatus: (copyId: string, newStatus: CopyStatus) => void;
	isLoading?: boolean;
}

const statusOptions = [
	{
		value: 'available',
		label: 'Sẵn sàng',
		description: 'Bản sao có thể cho mượn',
	},
	{
		value: 'borrowed',
		label: 'Đang mượn',
		description: 'Bản sao đang được mượn',
	},
	{
		value: 'reserved',
		label: 'Đã đặt trước',
		description: 'Bản sao đã được đặt trước',
	},
	{ value: 'damaged', label: 'Hư hỏng', description: 'Bản sao bị hư hỏng' },
	{ value: 'lost', label: 'Bị mất', description: 'Bản sao bị mất' },
	{
		value: 'maintenance',
		label: 'Bảo trì',
		description: 'Bản sao đang được bảo trì',
	},
];

export const UpdateStatusDialog = memo<UpdateStatusDialogProps>(
	({ open, onOpenChange, physicalCopy, onUpdateStatus, isLoading = false }) => {
		const handleUpdate = (newStatus: CopyStatus) => {
			if (physicalCopy) {
				onUpdateStatus(physicalCopy.id, newStatus);
			}
		};

		const handleCancel = () => {
			onOpenChange(false);
		};

		if (!physicalCopy) return null;

		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Cập nhật trạng thái bản sao</DialogTitle>
						<DialogDescription>
							Chọn trạng thái mới cho bản sao "{physicalCopy.barcode}" -{' '}
							{physicalCopy.book?.title}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* Current Status Display */}
						<div className="p-3 bg-muted/50 rounded-lg">
							<div className="text-sm text-muted-foreground">
								Trạng thái hiện tại:
							</div>
							<div className="font-medium capitalize">
								{statusOptions.find((opt) => opt.value === physicalCopy.status)
									?.label || physicalCopy.status}
							</div>
						</div>

						{/* Status Selection */}
						<div className="space-y-2">
							<label className="text-sm font-medium">Trạng thái mới:</label>
							<Select onValueChange={handleUpdate} disabled={isLoading}>
								<SelectTrigger>
									<SelectValue placeholder="Chọn trạng thái mới..." />
								</SelectTrigger>
								<SelectContent>
									{statusOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex flex-col">
												<span className="font-medium">{option.label}</span>
												<span className="text-xs text-muted-foreground">
													{option.description}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex justify-end space-x-2">
						<Button
							variant="outline"
							onClick={handleCancel}
							disabled={isLoading}
						>
							Hủy
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
	}
);

UpdateStatusDialog.displayName = 'UpdateStatusDialog';
