import { IconSearch, IconX } from '@tabler/icons-react';
import { memo, useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AuthorsSearchProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onClearSearch: () => void;
}

const AuthorsSearch = memo<AuthorsSearchProps>(
	({ searchQuery, onSearchChange, onClearSearch }) => {
		const [localQuery, setLocalQuery] = useState(searchQuery);

		const handleInputChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				setLocalQuery(e.target.value);
			},
			[]
		);

		const handleSearch = useCallback(() => {
			onSearchChange(localQuery);
		}, [localQuery, onSearchChange]);

		const handleClear = useCallback(() => {
			setLocalQuery('');
			onClearSearch();
		}, [onClearSearch]);

		const handleKeyPress = useCallback(
			(e: React.KeyboardEvent<HTMLInputElement>) => {
				if (e.key === 'Enter') {
					handleSearch();
				}
			},
			[handleSearch]
		);

		return (
			<div className="flex items-center space-x-2 mb-4">
				<div className="relative flex-1">
					<IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm tác giả theo tên, quốc tịch..."
						value={localQuery}
						onChange={handleInputChange}
						onKeyPress={handleKeyPress}
						className="pl-10 pr-10"
					/>
					{localQuery && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleClear}
							className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
						>
							<IconX className="h-3 w-3" />
						</Button>
					)}
				</div>
				<Button
					onClick={handleSearch}
					variant={localQuery ? 'default' : 'outline'}
				>
					<IconSearch className="mr-2 h-4 w-4" />
					Tìm kiếm
				</Button>
			</div>
		);
	}
);

AuthorsSearch.displayName = 'AuthorsSearch';

export default AuthorsSearch;
