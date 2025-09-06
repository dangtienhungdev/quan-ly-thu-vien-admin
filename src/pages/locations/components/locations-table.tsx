import { IconEdit, IconTrash } from '@tabler/icons-react';
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
import type { Location } from '@/types';
import { memo } from 'react';

interface LocationsTableProps {
	locations: Location[];
	onEdit: (location: Location) => void;
	onDelete: (location: Location) => void;
}

export const LocationsTable = memo(
	({ locations, onEdit, onDelete }: LocationsTableProps) => {
		return (
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tên vị trí</TableHead>
							<TableHead>Mô tả</TableHead>
							<TableHead>Tầng</TableHead>
							<TableHead>Khu vực</TableHead>
							<TableHead>Số kệ</TableHead>
							<TableHead>Trạng thái</TableHead>
							<TableHead>Ngày tạo</TableHead>
							<TableHead className="text-right">Thao tác</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{locations.map((location) => (
							<TableRow key={location.id}>
								<TableCell className="font-medium">{location.name}</TableCell>
								<TableCell>{location.description || '-'}</TableCell>
								<TableCell>{location.floor || '-'}</TableCell>
								<TableCell>{location.section || '-'}</TableCell>
								<TableCell>{location.shelf || '-'}</TableCell>
								<TableCell>
									<Badge variant={location.isActive ? 'default' : 'secondary'}>
										{location.isActive ? 'Hoạt động' : 'Tạm ngưng'}
									</Badge>
								</TableCell>
								<TableCell>
									{new Date(location.createdAt).toLocaleDateString('vi-VN')}
								</TableCell>
								<TableCell className="text-right">
									<div className="flex items-center justify-end gap-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onEdit(location)}
										>
											<IconEdit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onDelete(location)}
										>
											<IconTrash className="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}
);

LocationsTable.displayName = 'LocationsTable';
