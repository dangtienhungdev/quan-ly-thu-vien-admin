import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ReservationFiltersProps {
	searchQuery: string;
	selectedStatus: string;
	onSearchChange: (value: string) => void;
	onStatusChange: (status: string) => void;
}

export const ReservationFilters: React.FC<ReservationFiltersProps> = ({
	searchQuery,
	selectedStatus,
	onSearchChange,
	onStatusChange,
}) => {
	return (
		<div className="flex gap-4">
			<div className="flex-1">
				<div className="relative">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm đặt trước..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-8"
					/>
				</div>
			</div>
			{/* <Select value={selectedStatus} onValueChange={onStatusChange}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Trạng thái" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Tất cả trạng thái</SelectItem>
					<SelectItem value="pending">Đang chờ</SelectItem>
					<SelectItem value="fulfilled">Đã thực hiện</SelectItem>
					<SelectItem value="cancelled">Đã hủy</SelectItem>
					<SelectItem value="expired">Hết hạn</SelectItem>
				</SelectContent>
			</Select> */}
		</div>
	);
};
