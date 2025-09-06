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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

	return (
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
						<h3 className="text-lg font-semibold mb-2">Chưa có bản sao nào</h3>
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
								<TableHead className="w-[120px] text-right">Thao tác</TableHead>
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
									<TableCell className="font-medium">{copy.barcode}</TableCell>
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
												onClick={() => onUpdateStatus(copy.id, copy.status)}
												title="Cập nhật trạng thái"
											>
												<Settings className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												size="icon"
												onClick={() =>
													onUpdateCondition(copy.id, copy.current_condition)
												}
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
	);
}
