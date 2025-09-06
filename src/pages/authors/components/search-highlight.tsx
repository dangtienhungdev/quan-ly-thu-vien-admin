import { memo } from 'react';

interface SearchHighlightProps {
	text: string;
	searchQuery: string;
	className?: string;
}

const SearchHighlight = memo<SearchHighlightProps>(
	({ text, searchQuery, className }) => {
		if (!searchQuery || !text) {
			return <span className={className}>{text}</span>;
		}

		const regex = new RegExp(
			`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
			'gi'
		);
		const parts = text.split(regex);

		return (
			<span className={className}>
				{parts.map((part, index) => {
					if (regex.test(part)) {
						return (
							<mark
								key={index}
								className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
							>
								{part}
							</mark>
						);
					}
					return part;
				})}
			</span>
		);
	}
);

SearchHighlight.displayName = 'SearchHighlight';

export default SearchHighlight;
