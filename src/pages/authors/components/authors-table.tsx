import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { IconEdit, IconTrash } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Author } from '@/types/authors';
import { memo } from 'react';
import SearchHighlight from './search-highlight';

interface AuthorsTableProps {
	authors: Author[];
	onEdit: (author: Author) => void;
	onDelete: (author: { id: string; author_name: string; bio?: string }) => void;
	searchQuery?: string;
}

const AuthorsTable = memo<AuthorsTableProps>(
	({ authors, onEdit, onDelete, searchQuery }) => {
		if (authors.length === 0) {
			return (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tên tác giả</TableHead>
							<TableHead>Quốc tịch</TableHead>
							<TableHead>Tiểu sử</TableHead>
							<TableHead className="text-right">Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell colSpan={4} className="text-center py-8">
								{searchQuery ? (
									<div className="space-y-2">
										<p>Không tìm thấy tác giả nào cho "{searchQuery}"</p>
										<p className="text-sm text-muted-foreground">
											Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem tất
											cả tác giả
										</p>
									</div>
								) : (
									'Không tìm thấy tác giả nào'
								)}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			);
		}

		return (
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Tên tác giả</TableHead>
						<TableHead>Quốc tịch</TableHead>
						<TableHead>Tiểu sử</TableHead>
						<TableHead className="text-right">Hành động</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{authors.map((author) => (
						<TableRow key={author.id}>
							<TableCell className="font-medium">
								<SearchHighlight
									text={author.author_name}
									searchQuery={searchQuery || ''}
								/>
							</TableCell>
							<TableCell>
								<Badge variant="outline">
									<SearchHighlight
										text={author.nationality}
										searchQuery={searchQuery || ''}
									/>
								</Badge>
							</TableCell>
							<TableCell className="max-w-xs truncate">
								{author.bio ? (
									<SearchHighlight
										text={author.bio}
										searchQuery={searchQuery || ''}
									/>
								) : (
									'-'
								)}
							</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end space-x-1">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onEdit(author)}
										className="h-8 w-8 p-0 text-primary hover:text-primary"
									>
										<IconEdit className="h-4 w-4" />
										<span className="sr-only">Chỉnh sửa tác giả</span>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											onDelete({
												id: author.id,
												author_name: author.author_name,
												bio: author.bio,
											})
										}
										className="h-8 w-8 p-0 text-destructive hover:text-destructive"
									>
										<IconTrash className="h-4 w-4" />
										<span className="sr-only">Xóa tác giả</span>
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}
);

AuthorsTable.displayName = 'AuthorsTable';

export default AuthorsTable;
