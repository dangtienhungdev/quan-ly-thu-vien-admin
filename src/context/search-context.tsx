import { CommandMenu } from '@/components/command-menu';
import React from 'react';

interface SearchContextType {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Tạo giá trị mặc định cho context
const defaultContextValue: SearchContextType = {
	open: false,
	setOpen: () => {
		console.warn('SearchContext: setOpen was called without a Provider');
	},
};

const SearchContext =
	React.createContext<SearchContextType>(defaultContextValue);

interface Props {
	readonly children: React.ReactNode;
}

export function SearchProvider({ children }: Props) {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	const value = React.useMemo(() => ({ open, setOpen }), [open]);

	return (
		<SearchContext.Provider value={value}>
			{children}
			<CommandMenu />
		</SearchContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => {
	const searchContext = React.useContext(SearchContext);
	return searchContext;
};
