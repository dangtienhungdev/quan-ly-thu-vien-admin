import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import type { CopyCondition, CopyStatus, PhysicalCopy } from '@/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { memo } from 'react';

interface PhysicalCopyCardProps {
	copy: PhysicalCopy;
	onEdit: (copy: PhysicalCopy) => void;
	onDelete: (copy: PhysicalCopy) => void;
	onUpdateStatus: (copy: PhysicalCopy) => void;
	getStatusColor: (status: CopyStatus) => string;
	getConditionColor: (condition: CopyCondition) => string;
	getStatusIcon: (status: CopyStatus) => React.ReactNode;
	formatCurrency: (amount: number) => string;
}

export const PhysicalCopyCard = memo<PhysicalCopyCardProps>(
	({
		copy,
		onEdit,
		onDelete,
		onUpdateStatus,
		getStatusColor,
		getConditionColor,
		getStatusIcon,
		formatCurrency,
	}) => {
		return (
			<Card className="hover:shadow-lg transition-shadow">
				<CardHeader>
					<div className="flex justify-between items-start">
						<div className="flex-1">
							<CardTitle className="text-lg">{copy.book?.title}</CardTitle>
							<CardDescription>Barcode: {copy.barcode}</CardDescription>
						</div>
						<div className="flex flex-col gap-1">
							<Badge className={getStatusColor(copy.status)}>
								{getStatusIcon(copy.status)}
								<span className="ml-1">{copy.status}</span>
							</Badge>
							<Badge className={getConditionColor(copy.current_condition)}>
								{copy.current_condition}
							</Badge>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>Vị trí:</span>
							<span className="flex items-center">
								<MapPin className="mr-1 h-3 w-3" />
								{copy.location?.name || 'Chưa xác định'}
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span>Giá mua:</span>
							<span>{formatCurrency(copy.purchase_price)}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span>Ngày mua:</span>
							<span>
								{new Date(copy.purchase_date).toLocaleDateString('vi-VN')}
							</span>
						</div>
						{copy.condition_details && (
							<div className="text-sm text-muted-foreground">
								{copy.condition_details}
							</div>
						)}
					</div>
					<div className="flex gap-2 mt-4">
						<Button
							variant="outline"
							size="sm"
							className="flex-1"
							onClick={() => onEdit(copy)}
						>
							Chỉnh sửa
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onUpdateStatus(copy)}
						>
							Cập nhật trạng thái
						</Button>
						<Button variant="outline" size="sm" onClick={() => onDelete(copy)}>
							Xóa
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}
);

PhysicalCopyCard.displayName = 'PhysicalCopyCard';
