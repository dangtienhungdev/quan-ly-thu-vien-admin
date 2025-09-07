import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import type { BookCategory } from '@/types/book-categories';
import { Button } from '@/components/ui/button';

interface BookCategoriesTableProps {
	categories: BookCategory[];
	onEdit: (category: BookCategory) => void;
	onDelete: (category: BookCategory) => void;
	searchQuery?: string;
}

export default function BookCategoriesTable({
	categories,
	onEdit,
	onDelete,
}: BookCategoriesTableProps) {
	const formatDate = (dateString: string | undefined) => {
		if (!dateString) return '-';
		try {
			return new Date(dateString).toLocaleDateString('vi-VN');
		} catch {
			return '-';
		}
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Tên thể loại</TableHead>
					<TableHead>Thể loại cha</TableHead>
					<TableHead>Ngày tạo</TableHead>
					<TableHead className="w-[140px]">Hành động</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{categories.map((category: BookCategory) => (
					<TableRow key={category.id}>
						<TableCell className="font-medium">{category.name}</TableCell>
						<TableCell>{category.parent?.name || '-'}</TableCell>
						<TableCell>{formatDate(category.createdAt)}</TableCell>
						<TableCell>
							<div className="flex gap-2">
								<Button
									size="icon"
									variant="outline"
									onClick={() => onEdit(category)}
								>
									<IconEdit size={16} />
								</Button>
								<Button
									size="icon"
									variant="destructive"
									onClick={() => onDelete(category)}
								>
									<IconTrash size={16} />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
