import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CopyCondition, CopyStatus, PhysicalCopy } from '@/types';
import {
	AlertTriangle,
	BookOpen,
	Calendar,
	CheckCircle,
	FileText,
	MapPin,
	Plus,
} from 'lucide-react';

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
	console.log('🚀 ~ PhysicalListCard ~ physicalCopies:', physicalCopies);

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
					<div className="space-y-4">
						{physicalCopies.map((copy) => (
							<Card key={copy.id} className="hover:shadow-md transition-shadow">
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
												{getStatusIcon(copy.status)}
												<Badge className={getStatusColor(copy.status)}>
													{copy.status === 'available' && 'Sẵn sàng'}
													{copy.status === 'borrowed' && 'Đang mượn'}
													{copy.status === 'reserved' && 'Đã đặt trước'}
													{copy.status === 'damaged' && 'Hư hỏng'}
													{copy.status === 'lost' && 'Mất'}
													{copy.status === 'maintenance' && 'Bảo trì'}
												</Badge>
												<Badge
													className={getConditionColor(copy.current_condition)}
												>
													{copy.current_condition === 'new' && 'Mới'}
													{copy.current_condition === 'good' && 'Tốt'}
													{copy.current_condition === 'worn' && 'Cũ'}
													{copy.current_condition === 'damaged' && 'Hư hỏng'}
												</Badge>
											</div>
											<div className="space-y-1">
												<p className="font-medium">Barcode: {copy.barcode}</p>
												<div className="flex items-center space-x-4 text-sm text-muted-foreground">
													<span className="flex items-center">
														<MapPin className="mr-1 h-3 w-3" />
														{copy.location}
													</span>
													<span className="flex items-center">
														<Calendar className="mr-1 h-3 w-3" />
														Mua: {formatDate(copy.purchase_date)}
													</span>
													<span className="flex items-center">
														Giá: {formatPrice(copy.purchase_price)}
													</span>
												</div>
												{copy.condition_details && (
													<p className="text-sm text-muted-foreground">
														Chi tiết: {copy.condition_details}
													</p>
												)}
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => onUpdateStatus(copy.id, copy.status)}
											>
												Cập nhật trạng thái
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													onUpdateCondition(copy.id, copy.current_condition)
												}
											>
												Cập nhật tình trạng
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
