import { Card, CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { IconSearch } from '@tabler/icons-react';

interface SearchStatsProps {
	searchQuery: string;
	totalResults: number;
	currentPage: number;
	totalPages: number;
	itemsPerPage: number;
}

export default function SearchStats({
	searchQuery,
	totalResults,
	currentPage,
	totalPages,
	itemsPerPage,
}: SearchStatsProps) {
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalResults);

	return (
		<Card>
			<CardContent className="py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<IconSearch className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">
							Kết quả tìm kiếm cho:
						</span>
						<Badge variant="secondary">{searchQuery}</Badge>
					</div>
					<div className="text-sm text-muted-foreground">
						Hiển thị {startItem}-{endItem} trên {totalResults} kết quả
						{totalPages > 1 && (
							<span>
								{' '}
								(Trang {currentPage}/{totalPages})
							</span>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
