import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchableSelectProps {
	value: string;
	onValueChange: (value: string) => void;
	placeholder: string;
	searchPlaceholder: string;
	onSearch: (query: string) => Promise<any>;
	queryKey: string[];
	renderOption: (item: any) => { value: string; label: string };
	disabled?: boolean;
	initialData?: any[];
}

export function SearchableSelect({
	value,
	onValueChange,
	placeholder,
	searchPlaceholder,
	onSearch,
	queryKey,
	renderOption,
	disabled = false,
	initialData,
}: SearchableSelectProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [options, setOptions] = useState<any[]>([]);

	// Use initialData if provided, otherwise fetch via onSearch
	const { data: fetchedInitialData, isLoading: isLoadingInitial } = useQuery({
		queryKey: [...queryKey, 'initial'],
		queryFn: () => onSearch(''),
		enabled: !isSearching && !initialData,
	});

	// Search data
	const { data: searchData, isLoading: isLoadingSearch } = useQuery({
		queryKey: [...queryKey, 'search', searchQuery],
		queryFn: () => onSearch(searchQuery),
		enabled: isSearching && searchQuery.length > 0,
	});

	useEffect(() => {
		if (isSearching && searchData) {
			setOptions(searchData.data || []);
		} else if (!isSearching) {
			// Use initialData if provided, otherwise use fetched data
			const dataToUse = initialData || fetchedInitialData?.data || [];
			setOptions(dataToUse);
		}
	}, [isSearching, searchData, fetchedInitialData, initialData]);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setIsSearching(query.length > 0);
	};

	const handleClearSearch = () => {
		setSearchQuery('');
		setIsSearching(false);
	};

	const isLoading = isLoadingInitial || isLoadingSearch;

	return (
		<Select value={value} onValueChange={onValueChange} disabled={disabled}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{/* Search Input */}
				<div className="p-2 border-b">
					<div className="relative">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder={searchPlaceholder}
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							className="pl-8 pr-8"
						/>
						{searchQuery && (
							<Button
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-2"
								onClick={handleClearSearch}
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>

				{/* Options */}
				<div className="max-h-60 overflow-y-auto">
					{isLoading ? (
						<div className="p-2 text-center text-sm text-muted-foreground">
							Đang tải...
						</div>
					) : options.length === 0 ? (
						<div className="p-2 text-center text-sm text-muted-foreground">
							Không tìm thấy kết quả
						</div>
					) : (
						options.map((item) => {
							const { value: optionValue, label } = renderOption(item);
							return (
								<SelectItem key={optionValue} value={optionValue}>
									{label}
								</SelectItem>
							);
						})
					)}
				</div>
			</SelectContent>
		</Select>
	);
}
