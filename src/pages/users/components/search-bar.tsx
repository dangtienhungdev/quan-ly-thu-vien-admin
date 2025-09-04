import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconSearch } from '@tabler/icons-react';
import { memo } from 'react';

interface SearchBarProps {
	searchValue: string;
	onSearchChange: (value: string) => void;
	onSearch: () => void;
	onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	searchInputRef: React.RefObject<HTMLInputElement>;
	currentSearch: string;
}

export const SearchBar = memo<SearchBarProps>(
	({
		searchValue,
		onSearchChange,
		onSearch,
		onKeyPress,
		searchInputRef,
		currentSearch,
	}) => {
		return (
			<div className="mb-4">
				<div className="flex gap-2">
					<div className="relative flex-1">
						<IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							ref={searchInputRef}
							placeholder="Tìm kiếm theo mã, tên hoặc email..."
							value={searchValue}
							onChange={(e) => onSearchChange(e.target.value)}
							onKeyPress={onKeyPress}
							className="pl-10"
						/>
					</div>
					<Button
						onClick={onSearch}
						disabled={searchValue === currentSearch}
						className="px-6"
					>
						<IconSearch className="mr-2 h-4 w-4" />
						Tìm kiếm
					</Button>
				</div>
			</div>
		);
	}
);

SearchBar.displayName = 'SearchBar';
