import { Badge } from '@/components/ui/badge';
import { memo } from 'react';

interface SearchStatsProps {
	searchQuery: string;
	totalResults: number;
	currentPage: number;
	totalPages: number;
	itemsPerPage: number;
}

const SearchStats = memo<SearchStatsProps>(
	({ searchQuery, totalResults, currentPage, totalPages, itemsPerPage }) => {
		if (!searchQuery) return null;

		const startItem = (currentPage - 1) * itemsPerPage + 1;
		const endItem = Math.min(currentPage * itemsPerPage, totalResults);

		return (
			<div className="mb-4 p-3 bg-muted/50 rounded-lg">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Badge variant="secondary">Kết quả tìm kiếm</Badge>
						<span className="text-sm text-muted-foreground">
							"{searchQuery}"
						</span>
					</div>
					<div className="text-sm text-muted-foreground">
						{totalResults > 0 ? (
							<>
								Hiển thị {startItem}-{endItem} trong tổng số {totalResults} kết
								quả
							</>
						) : (
							'Không có kết quả nào'
						)}
					</div>
				</div>
			</div>
		);
	}
);

SearchStats.displayName = 'SearchStats';

export default SearchStats;
