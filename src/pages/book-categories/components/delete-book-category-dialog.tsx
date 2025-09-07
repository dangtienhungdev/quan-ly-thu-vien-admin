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

import type { BookCategory } from '@/types/book-categories';

interface DeleteBookCategoryDialogProps {
	isOpen: boolean;
	categoryToDelete: BookCategory | null;
	isDeleting: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export default function DeleteBookCategoryDialog({
	isOpen,
	categoryToDelete,
	isDeleting,
	onClose,
	onConfirm,
}: DeleteBookCategoryDialogProps) {
	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Xóa thể loại</AlertDialogTitle>
					<AlertDialogDescription>
						Bạn có chắc muốn xóa thể loại
						<span className="font-semibold"> {categoryToDelete?.name}</span>?
						Hành động này không thể hoàn tác.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose}>Hủy</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm} disabled={isDeleting}>
						{isDeleting ? 'Đang xóa...' : 'Xóa'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
