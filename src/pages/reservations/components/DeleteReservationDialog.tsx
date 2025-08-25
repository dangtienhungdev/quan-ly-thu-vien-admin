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

import type { Reservation } from '@/types/reservations';

interface DeleteReservationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	reservation: Reservation | null;
	onConfirm: () => void;
	isLoading: boolean;
}

export const DeleteReservationDialog: React.FC<
	DeleteReservationDialogProps
> = ({ open, onOpenChange, reservation, onConfirm, isLoading }) => {
	if (!reservation) return null;

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Xác nhận xóa đặt trước</AlertDialogTitle>
					<AlertDialogDescription>
						Bạn có chắc chắn muốn xóa đặt trước sách "{reservation.book?.title}"
						của độc giả "{reservation.reader?.fullName}"?
						<br />
						<br />
						Hành động này không thể hoàn tác.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={isLoading}
						className="bg-red-600 hover:bg-red-700"
					>
						{isLoading ? 'Đang xóa...' : 'Xóa'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
