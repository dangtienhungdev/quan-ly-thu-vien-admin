import {
	AlertTriangle,
	BookOpen,
	Calendar,
	CheckCircle,
	Edit,
	FileText,
	MapPin,
	Plus,
	Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CopyCondition, CopyStatus, PhysicalCopy } from '@/types';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface PhysicalListCardProps {
	physicalCopies: PhysicalCopy[];
	onCreateNew: () => void;
	onUpdateStatus: (copyId: string, status: CopyStatus) => void;
	onUpdateCondition: (copyId: string, condition: CopyCondition) => void;
}

export function PhysicalListCard({
	physicalCopies,
	onCreateNew,
	onUpdateStatus,
	onUpdateCondition,
}: PhysicalListCardProps) {
	const hasCopies = physicalCopies.length > 0;

	// Dialog state
	const [openUpdateStatusDialog, setOpenUpdateStatusDialog] = useState(false);
	const [openUpdateConditionDialog, setOpenUpdateConditionDialog] =
		useState(false);
	const [selectedCopy, setSelectedCopy] = useState<PhysicalCopy | null>(null);

	const getStatusColor = (status: string) => {
		const colors: Record<string, string> = {
			available: 'bg-green-100 text-green-800',
			borrowed: 'bg-blue-100 text-blue-800',
			reserved: 'bg-yellow-100 text-yellow-800',
			damaged: 'bg-red-100 text-red-800',
			lost: 'bg-gray-100 text-gray-800',
			maintenance: 'bg-orange-100 text-orange-800',
		};
		return colors[status] || 'bg-gray-100 text-gray-800';
	};

	const getConditionColor = (condition: string) => {
		const colors: Record<string, string> = {
			new: 'bg-green-100 text-green-800',
			good: 'bg-blue-100 text-blue-800',
			worn: 'bg-yellow-100 text-yellow-800',
			damaged: 'bg-red-100 text-red-800',
		};
		return colors[condition] || 'bg-gray-100 text-gray-800';
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'available':
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case 'borrowed':
				return <BookOpen className="h-4 w-4 text-blue-500" />;
			case 'reserved':
				return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
			case 'damaged':
			case 'lost':
			case 'maintenance':
				return <AlertTriangle className="h-4 w-4 text-red-500" />;
			default:
				return <FileText className="h-4 w-4 text-gray-500" />;
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN');
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(price);
	};

	// Status options for dialog
	const statusOptions = [
		{
			value: 'available',
			label: 'Sẵn sàng',
			description: 'Bản sao có thể cho mượn',
		},
		{
			value: 'borrowed',
			label: 'Đang mượn',
			description: 'Bản sao đang được mượn',
		},
		{
			value: 'reserved',
			label: 'Đã đặt trước',
			description: 'Bản sao đã được đặt trước',
		},
		{ value: 'damaged', label: 'Hư hỏng', description: 'Bản sao bị hư hỏng' },
		{ value: 'lost', label: 'Bị mất', description: 'Bản sao bị mất' },
		{
			value: 'maintenance',
			label: 'Bảo trì',
			description: 'Bản sao đang được bảo trì',
		},
	];

	// Condition options for dialog
	const conditionOptions = [
		{
			value: 'new',
			label: 'Mới',
			description: 'Bản sao hoàn toàn mới, chưa sử dụng',
		},
		{
			value: 'good',
			label: 'Tốt',
			description: 'Bản sao trong tình trạng tốt, ít dấu hiệu sử dụng',
		},
		{
			value: 'worn',
			label: 'Cũ',
			description: 'Bản sao đã sử dụng nhiều, có dấu hiệu hao mòn',
		},
		{
			value: 'damaged',
			label: 'Hư hỏng',
			description: 'Bản sao bị hư hỏng, cần sửa chữa',
		},
	];

	// Dialog handlers
	const handleUpdateStatusClick = (copy: PhysicalCopy) => {
		setSelectedCopy(copy);
		setOpenUpdateStatusDialog(true);
	};

	const handleUpdateStatus = (newStatus: CopyStatus) => {
		if (selectedCopy) {
			onUpdateStatus(selectedCopy.id, newStatus);
			setOpenUpdateStatusDialog(false);
			setSelectedCopy(null);
		}
	};

	const handleCancelUpdateStatus = () => {
		setOpenUpdateStatusDialog(false);
		setSelectedCopy(null);
	};

	const handleUpdateConditionClick = (copy: PhysicalCopy) => {
		setSelectedCopy(copy);
		setOpenUpdateConditionDialog(true);
	};

	const handleUpdateCondition = (newCondition: CopyCondition) => {
		if (selectedCopy) {
			onUpdateCondition(selectedCopy.id, newCondition);
			setOpenUpdateConditionDialog(false);
			setSelectedCopy(null);
		}
	};

	const handleCancelUpdateCondition = () => {
		setOpenUpdateConditionDialog(false);
		setSelectedCopy(null);
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<BookOpen className="h-5 w-5" />
							<span>Danh sách Bản sao Vật lý ({physicalCopies.length})</span>
						</div>
						<Button onClick={onCreateNew}>
							<Plus className="mr-2 h-4 w-4" />
							Tạo Bản sao mới
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{!hasCopies ? (
						<div className="text-center py-8">
							<BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">
								Chưa có bản sao nào
							</h3>
							<p className="text-muted-foreground mb-4">
								Sách này chưa có bản sao vật lý. Hãy tạo bản sao đầu tiên.
							</p>
							<Button onClick={onCreateNew}>
								<Plus className="mr-2 h-4 w-4" />
								Tạo Bản sao mới
							</Button>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">Trạng thái</TableHead>
									<TableHead className="w-[100px]">Tình trạng</TableHead>
									<TableHead className="w-[150px]">Barcode</TableHead>
									<TableHead className="w-[120px]">Vị trí</TableHead>
									<TableHead className="w-[120px]">Ngày mua</TableHead>
									<TableHead className="w-[120px]">Giá mua</TableHead>
									<TableHead className="w-[200px]">Chi tiết</TableHead>
									<TableHead className="w-[120px] text-right">
										Thao tác
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{physicalCopies.map((copy) => (
									<TableRow key={copy.id} className="hover:bg-muted/50">
										<TableCell>
											<div className="flex items-center space-x-2">
												{getStatusIcon(copy.status)}
												<Badge className={getStatusColor(copy.status)}>
													{copy.status === 'available' && 'Sẵn sàng'}
													{copy.status === 'borrowed' && 'Đang mượn'}
													{copy.status === 'reserved' && 'Đã đặt trước'}
													{copy.status === 'damaged' && 'Hư hỏng'}
													{copy.status === 'lost' && 'Mất'}
													{copy.status === 'maintenance' && 'Bảo trì'}
												</Badge>
											</div>
										</TableCell>
										<TableCell>
											<Badge
												className={getConditionColor(copy.current_condition)}
											>
												{copy.current_condition === 'new' && 'Mới'}
												{copy.current_condition === 'good' && 'Tốt'}
												{copy.current_condition === 'worn' && 'Cũ'}
												{copy.current_condition === 'damaged' && 'Hư hỏng'}
											</Badge>
										</TableCell>
										<TableCell className="font-medium">
											{copy.barcode}
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-1">
												<MapPin className="h-3 w-3 text-muted-foreground" />
												<span>{copy.location?.name || 'Chưa xác định'}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-1">
												<Calendar className="h-3 w-4 text-muted-foreground" />
												<span>{formatDate(copy.purchase_date)}</span>
											</div>
										</TableCell>
										<TableCell className="font-medium">
											{formatPrice(copy.purchase_price)}
										</TableCell>
										<TableCell>
											{copy.condition_details ? (
												<span className="text-sm text-muted-foreground">
													{copy.condition_details}
												</span>
											) : (
												<span className="text-sm text-muted-foreground">-</span>
											)}
										</TableCell>
										<TableCell className="text-right w-fit">
											<div className="flex items-center space-x-2 justify-end">
												<Button
													variant="outline"
													size="icon"
													onClick={() => handleUpdateStatusClick(copy)}
													title="Cập nhật trạng thái"
												>
													<Settings className="h-4 w-4" />
												</Button>
												<Button
													variant="outline"
													size="icon"
													onClick={() => handleUpdateConditionClick(copy)}
													title="Cập nhật tình trạng"
												>
													<Edit className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Update Status Dialog */}
			<Dialog
				open={openUpdateStatusDialog}
				onOpenChange={setOpenUpdateStatusDialog}
			>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Cập nhật trạng thái bản sao</DialogTitle>
						<DialogDescription>
							Chọn trạng thái mới cho bản sao "{selectedCopy?.barcode}" -{' '}
							{selectedCopy?.book?.title}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* Current Status Display */}
						<div className="p-3 bg-muted/50 rounded-lg">
							<div className="text-sm text-muted-foreground">
								Trạng thái hiện tại:
							</div>
							<div className="font-medium capitalize">
								{statusOptions.find((opt) => opt.value === selectedCopy?.status)
									?.label || selectedCopy?.status}
							</div>
						</div>

						{/* Status Selection */}
						<div className="space-y-2">
							<label className="text-sm font-medium">Trạng thái mới:</label>
							<Select onValueChange={handleUpdateStatus}>
								<SelectTrigger>
									<SelectValue placeholder="Chọn trạng thái mới..." />
								</SelectTrigger>
								<SelectContent>
									{statusOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex flex-col">
												<span className="font-medium">{option.label}</span>
												<span className="text-xs text-muted-foreground">
													{option.description}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex justify-end space-x-2">
						<Button variant="outline" onClick={handleCancelUpdateStatus}>
							Hủy
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Update Condition Dialog */}
			<Dialog
				open={openUpdateConditionDialog}
				onOpenChange={setOpenUpdateConditionDialog}
			>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Cập nhật tình trạng bản sao</DialogTitle>
						<DialogDescription>
							Chọn tình trạng mới cho bản sao "{selectedCopy?.barcode}" -{' '}
							{selectedCopy?.book?.title}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* Current Condition Display */}
						<div className="p-3 bg-muted/50 rounded-lg">
							<div className="text-sm text-muted-foreground">
								Tình trạng hiện tại:
							</div>
							<div className="font-medium capitalize">
								{conditionOptions.find(
									(opt) => opt.value === selectedCopy?.current_condition
								)?.label || selectedCopy?.current_condition}
							</div>
						</div>

						{/* Condition Selection */}
						<div className="space-y-2">
							<label className="text-sm font-medium">Tình trạng mới:</label>
							<Select onValueChange={handleUpdateCondition}>
								<SelectTrigger>
									<SelectValue placeholder="Chọn tình trạng mới..." />
								</SelectTrigger>
								<SelectContent>
									{conditionOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex flex-col">
												<span className="font-medium">{option.label}</span>
												<span className="text-xs text-muted-foreground">
													{option.description}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex justify-end space-x-2">
						<Button variant="outline" onClick={handleCancelUpdateCondition}>
							Hủy
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
