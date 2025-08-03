import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isLoading?: boolean;
	recordTitle?: string;
	readerName?: string;
}

export function DeleteConfirmDialog({
	open,
	onOpenChange,
	onConfirm,
	isLoading = false,
	recordTitle,
	readerName,
}: DeleteConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
							<AlertTriangle className="h-5 w-5 text-red-600" />
						</div>
						<div>
							<DialogTitle>Xác nhận xóa giao dịch</DialogTitle>
							<DialogDescription>
								Hành động này không thể hoàn tác.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="py-4">
					<p className="text-sm text-muted-foreground mb-2">
						Bạn có chắc chắn muốn xóa giao dịch mượn sách này?
					</p>
					{recordTitle && readerName && (
						<div className="bg-muted p-3 rounded-md">
							<p className="text-sm font-medium">Thông tin giao dịch:</p>
							<p className="text-sm text-muted-foreground">
								<strong>Sách:</strong> {recordTitle}
							</p>
							<p className="text-sm text-muted-foreground">
								<strong>Độc giả:</strong> {readerName}
							</p>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
					>
						Hủy
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={onConfirm}
						disabled={isLoading}
					>
						{isLoading ? 'Đang xóa...' : 'Xóa giao dịch'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
