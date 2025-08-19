/**
 * Hook for creating multiple reservations in bulk
 *
 * @example
 * ```tsx
 * const { createBulkReservations, isLoading } = useCreateBulkReservations({
 *   onSuccess: (data) => {
 *     console.log(`Created ${data.successCount} reservations`);
 *     console.log(`Failed ${data.failureCount} reservations`);
 *   }
 * });
 *
 * const handleBulkCreate = () => {
 *   createBulkReservations({
 *     reservations: [
 *       {
 *         reader_id: "reader-1",
 *         book_id: "book-1",
 *         reservation_date: "2024-01-01T10:00:00.000Z",
 *         expiry_date: "2024-01-08T10:00:00.000Z",
 *         reader_notes: "Cần sách này cho nghiên cứu",
 *         priority: 1
 *       }
 *     ]
 *   });
 * };
 * ```
 */

import { ReservationsAPI } from '@/apis/reservations';
import type {
	BulkReservationsResponse,
	CreateMultipleReservationsRequest,
} from '@/types/reservations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseCreateBulkReservationsOptions {
	onSuccess?: (data: BulkReservationsResponse) => void;
	onError?: (error: Error) => void;
}

export const useCreateBulkReservations = (
	options: UseCreateBulkReservationsOptions = {}
) => {
	const queryClient = useQueryClient();
	const { onSuccess, onError } = options;

	return useMutation({
		mutationFn: (data: CreateMultipleReservationsRequest) =>
			ReservationsAPI.createBulk(data),
		onSuccess: (data: BulkReservationsResponse) => {
			// Invalidate and refetch reservations queries
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({ queryKey: ['reservation-stats'] });

			// Show success message with details
			if (data.successCount > 0) {
				toast.success(
					`Đã tạo thành công ${data.successCount} đặt trước${
						data.failureCount > 0 ? `, ${data.failureCount} thất bại` : ''
					}`
				);
			}

			// Show error message for failed reservations
			if (data.failureCount > 0) {
				toast.error(
					`${data.failureCount} đặt trước thất bại. Vui lòng kiểm tra lại thông tin.`
				);
			}

			onSuccess?.(data);
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi tạo đặt trước hàng loạt');
			onError?.(error);
		},
	});
};
