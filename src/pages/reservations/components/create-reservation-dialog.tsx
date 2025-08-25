import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import React, { useState } from 'react';

import { BooksAPI } from '@/apis/books';
import { Button } from '@/components/ui/button';
import type { CreateReservationRequest } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '../../borrow-records/components/searchable-select';
import { Textarea } from '@/components/ui/textarea';
import { useReaders } from '@/hooks/readers';

interface CreateReservationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: CreateReservationRequest) => void;
	isLoading?: boolean;
}

export function CreateReservationDialog({
	open,
	onOpenChange,
	onSubmit,
	isLoading = false,
}: CreateReservationDialogProps) {
	const [formData, setFormData] = useState({
		reader_id: '',
		book_id: '',
		reservation_date: '',
		expiry_date: '',
		reader_notes: '',
		priority: 1,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	// Use the readers hook to get readers data
	const { readers, isLoading: readersLoading } = useReaders({
		params: { page: 1, limit: 1000 },
		enabled: open,
	});

	// Get current user profile (not used in this component but kept for future use)
	// const { data: profile } = useGetProfile();

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		// Required fields validation
		if (!formData.reader_id) {
			newErrors.reader_id = 'Vui lòng chọn độc giả';
		}

		if (!formData.book_id) {
			newErrors.book_id = 'Vui lòng chọn sách';
		}

		if (!formData.reservation_date) {
			newErrors.reservation_date = 'Vui lòng chọn ngày đặt trước';
		}

		if (!formData.expiry_date) {
			newErrors.expiry_date = 'Vui lòng chọn ngày hết hạn';
		}

		// Date validation
		if (formData.reservation_date && formData.expiry_date) {
			const reservationDate = new Date(formData.reservation_date);
			const expiryDate = new Date(formData.expiry_date);

			if (expiryDate <= reservationDate) {
				newErrors.expiry_date = 'Ngày hết hạn phải sau ngày đặt trước';
			}
		}

		// Priority validation
		if (formData.priority < 1 || formData.priority > 10) {
			newErrors.priority = 'Thứ tự ưu tiên phải từ 1 đến 10';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		// Prepare payload according to CreateReservationRequest
		const payload: CreateReservationRequest = {
			reader_id: formData.reader_id,
			book_id: formData.book_id,
			reservation_date: formData.reservation_date,
			expiry_date: formData.expiry_date,
			priority: Number(formData.priority),
		};

		// Add optional fields only if they have values
		if (formData.reader_notes) {
			payload.reader_notes = formData.reader_notes;
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
			book_id: '',
			reservation_date: '',
			expiry_date: '',
			reader_notes: '',
			priority: 1,
		});
		setErrors({});
	};

	const handleCancel = () => {
		resetForm();
		onOpenChange(false);
	};

	// Auto-calculate expiry date based on reservation date (default 2 days)
	const handleReservationDateChange = (date: string) => {
		handleInputChange('reservation_date', date);

		// Clear expiry date error if exists
		if (errors.expiry_date) {
			setErrors((prev) => ({ ...prev, expiry_date: '' }));
		}

		if (date && !formData.expiry_date) {
			const reservationDate = new Date(date);
			const expiryDate = new Date(
				reservationDate.getTime() + 2 * 24 * 60 * 60 * 1000
			); // +2 days (ngày hôm đó + 1 ngày nữa)
			handleInputChange('expiry_date', expiryDate.toISOString().split('T')[0]);
		}
	};

	// Search function using the readers hook data
	const searchReaders = async (query: string) => {
		if (!query.trim()) {
			return {
				data: readers,
				meta: { total: readers.length },
			};
		}

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

	const searchBooks = async (query: string) => {
		if (query) {
			return BooksAPI.search({ q: query, page: 1, limit: 20 });
		}
		return BooksAPI.getAll({ page: 1, limit: 20 });
	};

	// Render functions for options
	const renderReaderOption = (reader: any) => ({
		value: reader.id,
		label: `${reader.fullName} (${reader.cardNumber})`,
	});

	const renderBookOption = (book: any) => ({
		value: book.id,
		label: `${book.title} (${book.isbn})`,
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Tạo Đặt Trước Mới</DialogTitle>
					<DialogDescription>
						Tạo yêu cầu đặt trước sách mới cho độc giả
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
							<Label htmlFor="book_id">Sách *</Label>
							<SearchableSelect
								value={formData.book_id}
								onValueChange={(value) => handleInputChange('book_id', value)}
								placeholder="Chọn sách"
								searchPlaceholder="Tìm kiếm sách..."
								onSearch={searchBooks}
								queryKey={['books', 'search']}
								renderOption={renderBookOption}
								disabled={isLoading}
							/>
							{errors.book_id && (
								<p className="text-sm text-red-600">{errors.book_id}</p>
							)}
						</div>
					</div>

					{/* Dates */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="reservation_date">Ngày đặt trước *</Label>
							<Input
								id="reservation_date"
								type="date"
								value={formData.reservation_date}
								onChange={(e) => handleReservationDateChange(e.target.value)}
							/>
							{errors.reservation_date && (
								<p className="text-sm text-red-600">
									{errors.reservation_date}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="expiry_date">Ngày hết hạn *</Label>
							<Input
								id="expiry_date"
								type="date"
								value={formData.expiry_date}
								onChange={(e) =>
									handleInputChange('expiry_date', e.target.value)
								}
							/>
							{errors.expiry_date && (
								<p className="text-sm text-red-600">{errors.expiry_date}</p>
							)}
						</div>
					</div>

					{/* Priority */}
					<div className="space-y-2">
						<Label htmlFor="priority">Thứ tự ưu tiên</Label>
						<Input
							id="priority"
							type="number"
							min="1"
							max="10"
							value={formData.priority}
							onChange={(e) => handleInputChange('priority', e.target.value)}
							placeholder="1"
						/>
						{errors.priority && (
							<p className="text-sm text-red-600">{errors.priority}</p>
						)}
					</div>

					{/* Notes */}
					<div className="space-y-2">
						<Label htmlFor="reader_notes">Ghi chú của độc giả</Label>
						<Textarea
							id="reader_notes"
							value={formData.reader_notes}
							onChange={(e) =>
								handleInputChange('reader_notes', e.target.value)
							}
							placeholder="Ghi chú về yêu cầu đặt trước..."
							rows={3}
							maxLength={500}
						/>
						<p className="text-sm text-muted-foreground">
							{formData.reader_notes.length}/500 ký tự
						</p>
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
							{isLoading ? 'Đang tạo...' : 'Tạo Đặt Trước'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
