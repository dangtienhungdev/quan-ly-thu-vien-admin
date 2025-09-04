import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { memo } from 'react';

interface DeleteConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userToDelete: {
		id: string;
		userCode: string;
		username: string;
	} | null;
	onConfirm: () => void;
	onClose: () => void;
	isDeleting: boolean;
}

export const DeleteConfirmDialog = memo<DeleteConfirmDialogProps>(
	({ open, onOpenChange, userToDelete, onConfirm, onClose, isDeleting }) => {
		return (
			<AlertDialog open={open} onOpenChange={onOpenChange}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa người dùng{' '}
							<strong>{userToDelete?.userCode}</strong> (
							{userToDelete?.username})?
							<br />
							Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={onClose}>Hủy</AlertDialogCancel>
						<AlertDialogAction
							onClick={onConfirm}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? 'Đang xóa...' : 'Xóa'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}
);

DeleteConfirmDialog.displayName = 'DeleteConfirmDialog';
