import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconSearch } from '@tabler/icons-react';
import { useRef } from 'react';

interface PublishersSearchProps {
	searchValue: string;
	onSearchChange: (value: string) => void;
	onSearch: () => void;
	currentSearch: string;
}

const PublishersSearch = ({
	searchValue,
	onSearchChange,
	onSearch,
	currentSearch,
}: PublishersSearchProps) => {
	const searchInputRef = useRef<HTMLInputElement>(null);

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onSearch();
		}
	};

	return (
		<div className="mb-4">
			<div className="flex gap-2">
				<div className="relative flex-1">
					<IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						ref={searchInputRef}
						placeholder="Tìm kiếm theo tên, địa chỉ, email, điện thoại hoặc quốc gia..."
						value={searchValue}
						onChange={(e) => onSearchChange(e.target.value)}
						onKeyPress={handleKeyPress}
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
};

export default PublishersSearch;
