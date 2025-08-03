import { PhysicalCopiesAPI } from '@/apis';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useReaders } from '@/hooks/readers';
import { useGetProfile } from '@/hooks/users/use-get-profile';
import type { CreateBorrowRecordRequest } from '@/types';
import React, { useState } from 'react';
import { SearchableSelect } from './searchable-select';

interface CreateBorrowRecordDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: CreateBorrowRecordRequest) => void;
	isLoading?: boolean;
}

export function CreateBorrowRecordDialog({
	open,
	onOpenChange,
	onSubmit,
	isLoading = false,
}: CreateBorrowRecordDialogProps) {
	const [formData, setFormData] = useState({
		reader_id: '',
		copy_id: '',
		borrow_date: '',
		due_date: '',
		return_date: '',
		status: 'borrowed' as const,
		// librarian_id: '',
		borrow_notes: '',
		return_notes: '',
		renewal_count: 0,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	// Use the readers hook to get readers data
	const { readers, isLoading: readersLoading } = useReaders({
		params: { page: 1, limit: 1000 },
		enabled: open, // Only fetch when dialog is open
	});

	// get me
	const { data: profile } = useGetProfile();

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		// Required fields validation
		if (!formData.reader_id) {
			newErrors.reader_id = 'Vui lòng chọn độc giả';
		}

		if (!formData.copy_id) {
			newErrors.copy_id = 'Vui lòng chọn bản sao sách';
		}

		// if (!formData.librarian_id) {
		// 	newErrors.librarian_id = 'Vui lòng nhập ID thủ thư';
		// }

		// Date validation
		if (formData.borrow_date && formData.due_date) {
			const borrowDate = new Date(formData.borrow_date);
			const dueDate = new Date(formData.due_date);

			if (dueDate <= borrowDate) {
				newErrors.due_date = 'Ngày hạn trả phải sau ngày mượn';
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		// Prepare payload according to CreateBorrowRecordRequest
		const payload: CreateBorrowRecordRequest = {
			reader_id: formData.reader_id,
			copy_id: formData.copy_id,
			status: formData.status,
			librarian_id: profile?.id || '',
			renewal_count: Number(formData.renewal_count),
		};

		// Add optional fields only if they have values
		if (formData.borrow_date) {
			payload.borrow_date = formData.borrow_date;
		}

		if (formData.due_date) {
			payload.due_date = formData.due_date;
		}

		if (formData.return_date) {
			payload.return_date = formData.return_date;
		}

		if (formData.borrow_notes) {
			payload.borrow_notes = formData.borrow_notes;
		}

		if (formData.return_notes) {
			payload.return_notes = formData.return_notes;
		}

		onSubmit(payload);
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
	};

	const resetForm = () => {
		setFormData({
			reader_id: '',
			copy_id: '',
			borrow_date: '',
			due_date: '',
			return_date: '',
			status: 'borrowed' as const,
			// librarian_id: '',
			borrow_notes: '',
			return_notes: '',
			renewal_count: 0,
		});
		setErrors({});
	};

	const handleCancel = () => {
		resetForm();
		onOpenChange(false);
	};

	// Auto-calculate due date based on borrow date (default 14 days)
	const handleBorrowDateChange = (date: string) => {
		handleInputChange('borrow_date', date);

		// Clear due date error if exists
		if (errors.due_date) {
			setErrors((prev) => ({ ...prev, due_date: '' }));
		}

		if (date && !formData.due_date) {
			const borrowDate = new Date(date);
			const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 days
			handleInputChange('due_date', dueDate.toISOString().split('T')[0]);
		}
	};

	// Search function using the readers hook data
	const searchReaders = async (query: string) => {
		// If no query, return all readers
		if (!query.trim()) {
			return {
				data: readers,
				meta: { total: readers.length },
			};
		}

		// Filter readers based on query
		const filteredReaders = readers.filter(
			(reader) =>
				reader.fullName?.toLowerCase().includes(query.toLowerCase()) ||
				reader.cardNumber?.toLowerCase().includes(query.toLowerCase())
		);

		return {
			data: filteredReaders,
			meta: { total: filteredReaders.length },
		};
	};

	const searchPhysicalCopies = async (query: string) => {
		if (query) {
			return PhysicalCopiesAPI.search({ q: query, page: 1, limit: 20 });
		}
		return PhysicalCopiesAPI.getAll({ page: 1, limit: 20 });
	};

	// Render functions for options
	const renderReaderOption = (reader: any) => ({
		value: reader.id,
		label: `${reader.fullName} (${reader.cardNumber})`,
	});

	const renderPhysicalCopyOption = (copy: any) => ({
		value: copy.id,
		label: `${copy.book?.title || 'Không có tên sách'} - ${copy.barcode} (${
			copy.status
		})`,
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Tạo Giao dịch Mượn mới</DialogTitle>
					<DialogDescription>
						Tạo bản ghi mượn sách mới cho độc giả
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Basic Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="reader_id">Độc giả *</Label>
							<SearchableSelect
								value={formData.reader_id}
								onValueChange={(value) => handleInputChange('reader_id', value)}
								placeholder="Chọn độc giả"
								searchPlaceholder="Tìm kiếm độc giả..."
								onSearch={searchReaders}
								queryKey={['readers', 'search']}
								renderOption={renderReaderOption}
								disabled={isLoading || readersLoading}
								initialData={readers}
							/>
							{errors.reader_id && (
								<p className="text-sm text-red-600">{errors.reader_id}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="copy_id">Bản sao sách *</Label>
							<SearchableSelect
								value={formData.copy_id}
								onValueChange={(value) => handleInputChange('copy_id', value)}
								placeholder="Chọn bản sao sách"
								searchPlaceholder="Tìm kiếm bản sao..."
								onSearch={searchPhysicalCopies}
								queryKey={['physical-copies', 'search']}
								renderOption={renderPhysicalCopyOption}
								disabled={isLoading}
							/>
							{errors.copy_id && (
								<p className="text-sm text-red-600">{errors.copy_id}</p>
							)}
						</div>
					</div>

					{/* Dates */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="borrow_date">Ngày mượn</Label>
							<Input
								id="borrow_date"
								type="date"
								value={formData.borrow_date}
								onChange={(e) => handleBorrowDateChange(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="due_date">Ngày hạn trả</Label>
							<Input
								id="due_date"
								type="date"
								value={formData.due_date}
								onChange={(e) => handleInputChange('due_date', e.target.value)}
							/>
							{errors.due_date && (
								<p className="text-sm text-red-600">{errors.due_date}</p>
							)}
						</div>
					</div>

					{/* Librarian */}
					{/* <div className="space-y-2">
						<Label htmlFor="librarian_id">ID Thủ thư *</Label>
						<Input
							id="librarian_id"
							type="text"
							value={formData.librarian_id}
							onChange={(e) =>
								handleInputChange('librarian_id', e.target.value)
							}
							placeholder="UUID của thủ thư"
							required
						/>
						{errors.librarian_id && (
							<p className="text-sm text-red-600">{errors.librarian_id}</p>
						)}
					</div> */}

					{/* Status and Return Date */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="status">Trạng thái</Label>
							<Select
								value={formData.status}
								onValueChange={(value) => handleInputChange('status', value)}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Chọn trạng thái" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="borrowed">Đã mượn</SelectItem>
									<SelectItem value="returned">Đã trả</SelectItem>
									<SelectItem value="overdue">Quá hạn</SelectItem>
									<SelectItem value="renewed">Đã gia hạn</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="return_date">Ngày trả</Label>
							<Input
								id="return_date"
								type="date"
								value={formData.return_date}
								onChange={(e) =>
									handleInputChange('return_date', e.target.value)
								}
							/>
						</div>
					</div>

					{/* Renewal Count */}
					<div className="space-y-2">
						<Label htmlFor="renewal_count">Số lần gia hạn</Label>
						<Input
							id="renewal_count"
							type="number"
							min="0"
							max="10"
							value={formData.renewal_count}
							onChange={(e) =>
								handleInputChange('renewal_count', e.target.value)
							}
							placeholder="0"
						/>
					</div>

					{/* Notes */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="borrow_notes">Ghi chú mượn</Label>
							<Textarea
								id="borrow_notes"
								value={formData.borrow_notes}
								onChange={(e) =>
									handleInputChange('borrow_notes', e.target.value)
								}
								placeholder="Ghi chú khi mượn sách..."
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="return_notes">Ghi chú trả</Label>
							<Textarea
								id="return_notes"
								value={formData.return_notes}
								onChange={(e) =>
									handleInputChange('return_notes', e.target.value)
								}
								placeholder="Ghi chú khi trả sách..."
								rows={3}
							/>
						</div>
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
							{isLoading ? 'Đang tạo...' : 'Tạo Giao dịch'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
