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

interface DeleteAuthorDialogProps {
	isOpen: boolean;
	authorToDelete: {
		id: string;
		author_name: string;
		bio?: string;
	} | null;
	isDeleting: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const DeleteAuthorDialog = memo<DeleteAuthorDialogProps>(
	({ isOpen, authorToDelete, isDeleting, onClose, onConfirm }) => {
		return (
			<AlertDialog open={isOpen} onOpenChange={onClose}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa tác giả</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa tác giả{' '}
							<strong>{authorToDelete?.author_name}</strong>?
							<br />
							Hành động này không thể hoàn tác.
							{authorToDelete?.bio && (
								<>
									<br />
									<strong>Tiểu sử:</strong> {authorToDelete.bio}
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={onClose}>Hủy</AlertDialogCancel>
						<AlertDialogAction
							onClick={onConfirm}
							disabled={isDeleting}
							className="bg-destructive text-white hover:bg-destructive/90 "
						>
							{isDeleting ? 'Đang xóa...' : 'Xóa'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}
);

DeleteAuthorDialog.displayName = 'DeleteAuthorDialog';

export default DeleteAuthorDialog;
