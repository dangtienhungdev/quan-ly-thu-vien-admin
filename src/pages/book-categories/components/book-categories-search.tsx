import { IconSearch, IconX } from '@tabler/icons-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BookCategoriesSearchProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onClearSearch: () => void;
}

export default function BookCategoriesSearch({
	searchQuery,
	onSearchChange,
	onClearSearch,
}: BookCategoriesSearchProps) {
	const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

	const handleSearch = useCallback(() => {
		onSearchChange(localSearchQuery);
	}, [localSearchQuery, onSearchChange]);

	const handleClearSearch = useCallback(() => {
		setLocalSearchQuery('');
		onClearSearch();
	}, [onClearSearch]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				handleSearch();
			}
		},
		[handleSearch]
	);

	return (
		<div className="flex items-center space-x-2 mb-6">
			<div className="relative flex-1 max-w-sm">
				<IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
				<Input
					placeholder="Tìm kiếm thể loại..."
					value={localSearchQuery}
					onChange={(e) => setLocalSearchQuery(e.target.value)}
					onKeyPress={handleKeyPress}
					className="pl-10 pr-10"
				/>
				{localSearchQuery && (
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
						onClick={handleClearSearch}
					>
						<IconX className="h-3 w-3" />
					</Button>
				)}
			</div>
			<Button onClick={handleSearch} variant="outline">
				Tìm kiếm
			</Button>
		</div>
	);
}
