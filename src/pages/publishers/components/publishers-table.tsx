import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { IconEdit, IconSwitch, IconTrash } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Publisher } from '@/types/publishers';

interface PublishersTableProps {
	publishers: Publisher[];
	currentSearch: string;
	onToggleStatus: (publisher: Publisher) => void;
	onEdit: (publisher: Publisher) => void;
	onDelete: (publisher: {
		id: string;
		publisherName: string;
		description?: string;
	}) => void;
	isToggling: boolean;
}

const PublishersTable = ({
	publishers,
	currentSearch,
	onToggleStatus,
	onEdit,
	onDelete,
	isToggling,
}: PublishersTableProps) => {
	const getStatusBadgeVariant = (
		isActive: boolean
	): 'default' | 'secondary' => {
		return isActive ? 'default' : 'secondary';
	};

	const getStatusLabel = (isActive: boolean): string => {
		return isActive ? 'Đang hoạt động' : 'Không hoạt động';
	};

	const formatDate = (dateString?: string): string => {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('vi-VN');
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Tên nhà xuất bản</TableHead>
					<TableHead>Địa chỉ</TableHead>
					<TableHead>Liên hệ</TableHead>
					<TableHead>Quốc gia</TableHead>
					<TableHead>Ngày thành lập</TableHead>
					<TableHead>Trạng thái</TableHead>
					<TableHead className="text-right">Hành động</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{publishers.length === 0 ? (
					<TableRow>
						<TableCell colSpan={7} className="text-center py-8">
							{currentSearch
								? `Không tìm thấy nhà xuất bản nào phù hợp với "${currentSearch}"`
								: 'Không có nhà xuất bản nào'}
						</TableCell>
					</TableRow>
				) : (
					publishers.map((publisher) => (
						<TableRow key={publisher.id}>
							<TableCell className="font-medium">
								{publisher.publisherName}
							</TableCell>
							<TableCell className="max-w-xs truncate">
								{publisher.address}
							</TableCell>
							<TableCell>
								<div className="space-y-1">
									<div className="text-sm">{publisher.phone}</div>
									<div className="text-sm text-muted-foreground">
										{publisher.email}
									</div>
									{publisher.website && (
										<a
											href={publisher.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-blue-600 hover:underline"
										>
											Website
										</a>
									)}
								</div>
							</TableCell>
							<TableCell>{publisher.country || '-'}</TableCell>
							<TableCell>{formatDate(publisher.establishedDate)}</TableCell>
							<TableCell>
								<Badge variant={getStatusBadgeVariant(publisher.isActive)}>
									{getStatusLabel(publisher.isActive)}
								</Badge>
							</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end space-x-1">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onToggleStatus(publisher)}
										disabled={isToggling}
										className="h-8 w-8 p-0 text-orange-600 hover:text-orange-600"
									>
										<IconSwitch className="h-4 w-4" />
										<span className="sr-only">Chuyển đổi trạng thái</span>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onEdit(publisher)}
										className="h-8 w-8 p-0 text-primary hover:text-primary"
									>
										<IconEdit className="h-4 w-4" />
										<span className="sr-only">Chỉnh sửa nhà xuất bản</span>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											onDelete({
												id: publisher.id,
												publisherName: publisher.publisherName,
												description: publisher.description,
											})
										}
										className="h-8 w-8 p-0 text-destructive hover:text-destructive"
									>
										<IconTrash className="h-4 w-4" />
										<span className="sr-only">Xóa nhà xuất bản</span>
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
};

export default PublishersTable;
