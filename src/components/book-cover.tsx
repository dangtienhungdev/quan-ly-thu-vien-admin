import { IconBook } from '@tabler/icons-react';

interface BookCoverProps {
	src?: string;
	alt?: string;
	className?: string;
	size?: 'sm' | 'md' | 'lg';
}

const BookCover = ({
	src,
	alt = 'Book cover',
	className = '',
	size = 'md',
}: BookCoverProps) => {
	const sizeClasses = {
		sm: 'w-8 h-8',
		md: 'w-12 h-16',
		lg: 'w-24 h-32',
	};

	const baseClasses = `${sizeClasses[size]} rounded border bg-muted flex items-center justify-center`;

	if (!src) {
		return (
			<div className={`${baseClasses} ${className}`}>
				<IconBook className="h-4 w-4 text-muted-foreground" />
			</div>
		);
	}

	return (
		<img
			src={src}
			alt={alt}
			className={`${baseClasses} object-cover ${className}`}
			onError={(e) => {
				// Fallback to icon if image fails to load
				const target = e.target as HTMLImageElement;
				target.style.display = 'none';
				const parent = target.parentElement;
				if (parent) {
					parent.innerHTML = `
						<div class="${baseClasses} ${className}">
							<svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
							</svg>
						</div>
					`;
				}
			}}
		/>
	);
};

export default BookCover;
