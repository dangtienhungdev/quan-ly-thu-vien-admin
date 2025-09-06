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

interface DeletePublisherDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	publisherToDelete: {
		id: string;
		publisherName: string;
		description?: string;
	} | null;
	onConfirm: () => void;
	isDeleting: boolean;
}

const DeletePublisherDialog = ({
	isOpen,
	onOpenChange,
	publisherToDelete,
	onConfirm,
	isDeleting,
}: DeletePublisherDialogProps) => {
	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Xác nhận xóa nhà xuất bản</AlertDialogTitle>
					<AlertDialogDescription>
						Bạn có chắc chắn muốn xóa nhà xuất bản{' '}
						<strong>{publisherToDelete?.publisherName}</strong>?
						<br />
						Hành động này không thể hoàn tác.
						{publisherToDelete?.description && (
							<>
								<br />
								<strong>Mô tả:</strong> {publisherToDelete.description}
							</>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => onOpenChange(false)}>
						Hủy
					</AlertDialogCancel>
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
};

export default DeletePublisherDialog;
