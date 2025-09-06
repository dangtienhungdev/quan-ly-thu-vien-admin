import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { memo } from 'react';

interface PhysicalCopiesFiltersProps {
	searchQuery: string;
	selectedStatus: string;
	selectedCondition: string;
	selectedLocation: string;
	locationsData?: Array<{ id: string; name: string }>;
	onSearchChange: (value: string) => void;
	onStatusChange: (status: string) => void;
	onConditionChange: (condition: string) => void;
	onLocationChange: (location: string) => void;
}

export const PhysicalCopiesFilters = memo<PhysicalCopiesFiltersProps>(
	({
		searchQuery,
		selectedStatus,
		selectedCondition,
		selectedLocation,
		locationsData,
		onSearchChange,
		onStatusChange,
		onConditionChange,
		onLocationChange,
	}) => {
		return (
			<div className="flex gap-4">
				<div className="flex-1">
					<div className="relative">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Tìm kiếm bản sao theo barcode, tên sách..."
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className="pl-8"
						/>
					</div>
				</div>
				<Select value={selectedStatus} onValueChange={onStatusChange}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Trạng thái" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tất cả trạng thái</SelectItem>
						<SelectItem value="available">Sẵn sàng</SelectItem>
						<SelectItem value="borrowed">Đang mượn</SelectItem>
						<SelectItem value="reserved">Đã đặt</SelectItem>
						<SelectItem value="damaged">Hư hỏng</SelectItem>
						<SelectItem value="lost">Bị mất</SelectItem>
						<SelectItem value="maintenance">Bảo trì</SelectItem>
					</SelectContent>
				</Select>
				<Select value={selectedCondition} onValueChange={onConditionChange}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Tình trạng" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tất cả tình trạng</SelectItem>
						<SelectItem value="new">Mới</SelectItem>
						<SelectItem value="good">Tốt</SelectItem>
						<SelectItem value="worn">Cũ</SelectItem>
						<SelectItem value="damaged">Hư hỏng</SelectItem>
					</SelectContent>
				</Select>
				<Select value={selectedLocation} onValueChange={onLocationChange}>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="Vị trí" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tất cả vị trí</SelectItem>
						{locationsData?.map((location) => (
							<SelectItem key={location.id} value={location.id}>
								{location.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		);
	}
);

PhysicalCopiesFilters.displayName = 'PhysicalCopiesFilters';
