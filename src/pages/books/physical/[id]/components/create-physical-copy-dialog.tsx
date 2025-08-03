import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import type {
	CopyCondition,
	CopyStatus,
	CreatePhysicalCopyRequest,
} from '@/types';
import React, { useState } from 'react';

interface CreatePhysicalCopyDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	bookId: string;
	bookTitle?: string;
	onSubmit: (data: CreatePhysicalCopyRequest) => void;
	isLoading?: boolean;
}

export function CreatePhysicalCopyDialog({
	open,
	onOpenChange,
	bookId,
	bookTitle,
	onSubmit,
	isLoading = false,
}: CreatePhysicalCopyDialogProps) {
	const [formData, setFormData] = useState({
		barcode: '',
		status: 'available' as CopyStatus,
		current_condition: 'new' as CopyCondition,
		condition_details: '',
		purchase_date: '',
		purchase_price: 0,
		location: '',
		notes: '',
		last_checkup_date: '',
		is_archived: false,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({
			book_id: bookId,
			...formData,
			purchase_price: Number(formData.purchase_price),
		});
	};

	const handleInputChange = (
		field: string,
		value: string | number | boolean
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const resetForm = () => {
		setFormData({
			barcode: '',
			status: 'available' as CopyStatus,
			current_condition: 'new' as CopyCondition,
			condition_details: '',
			purchase_date: '',
			purchase_price: 0,
			location: '',
			notes: '',
			last_checkup_date: '',
			is_archived: false,
		});
	};

	const handleCancel = () => {
		resetForm();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Tạo Bản sao Vật lý mới</DialogTitle>
					<DialogDescription>
						Thêm bản sao vật lý cho sách "{bookTitle}"
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Basic Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="barcode">Barcode *</Label>
							<Input
								id="barcode"
								type="text"
								value={formData.barcode}
								onChange={(e) => handleInputChange('barcode', e.target.value)}
								placeholder="LIB-2024-001"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="status">Trạng thái *</Label>
							<Select
								value={formData.status}
								onValueChange={(value) =>
									handleInputChange('status', value as CopyStatus)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Chọn trạng thái" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="available">Sẵn sàng</SelectItem>
									<SelectItem value="borrowed">Đang mượn</SelectItem>
									<SelectItem value="reserved">Đã đặt trước</SelectItem>
									<SelectItem value="damaged">Hư hỏng</SelectItem>
									<SelectItem value="lost">Mất</SelectItem>
									<SelectItem value="maintenance">Bảo trì</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Purchase Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="purchase_date">Ngày mua *</Label>
							<Input
								id="purchase_date"
								type="date"
								value={formData.purchase_date}
								onChange={(e) =>
									handleInputChange('purchase_date', e.target.value)
								}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="purchase_price">Giá mua (VND) *</Label>
							<Input
								id="purchase_price"
								type="number"
								value={formData.purchase_price}
								onChange={(e) =>
									handleInputChange('purchase_price', Number(e.target.value))
								}
								placeholder="75000"
								required
							/>
						</div>
					</div>

					{/* Location and Condition */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="location">Vị trí *</Label>
							<Input
								id="location"
								type="text"
								value={formData.location}
								onChange={(e) => handleInputChange('location', e.target.value)}
								placeholder="Kệ A2-T3"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="current_condition">Tình trạng *</Label>
							<Select
								value={formData.current_condition}
								onValueChange={(value) =>
									handleInputChange('current_condition', value as CopyCondition)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Chọn tình trạng" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="new">Mới</SelectItem>
									<SelectItem value="good">Tốt</SelectItem>
									<SelectItem value="worn">Cũ</SelectItem>
									<SelectItem value="damaged">Hư hỏng</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Checkup Date and Archive Status */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="last_checkup_date">Ngày kiểm tra cuối</Label>
							<Input
								id="last_checkup_date"
								type="date"
								value={formData.last_checkup_date}
								onChange={(e) =>
									handleInputChange('last_checkup_date', e.target.value)
								}
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center space-x-2 pt-6">
								<Checkbox
									id="is_archived"
									checked={formData.is_archived}
									onCheckedChange={(checked) =>
										handleInputChange('is_archived', checked as boolean)
									}
								/>
								<Label htmlFor="is_archived">Đã lưu trữ</Label>
							</div>
						</div>
					</div>

					{/* Details and Notes */}
					<div className="space-y-2">
						<Label htmlFor="condition_details">Chi tiết tình trạng</Label>
						<Textarea
							id="condition_details"
							value={formData.condition_details}
							onChange={(e) =>
								handleInputChange('condition_details', e.target.value)
							}
							placeholder="Mô tả chi tiết về tình trạng bản sao..."
							rows={3}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="notes">Ghi chú</Label>
						<Textarea
							id="notes"
							value={formData.notes}
							onChange={(e) => handleInputChange('notes', e.target.value)}
							placeholder="Ghi chú bổ sung..."
							rows={2}
						/>
					</div>

					{/* Form Actions */}
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
							{isLoading ? 'Đang tạo...' : 'Tạo Bản sao'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
