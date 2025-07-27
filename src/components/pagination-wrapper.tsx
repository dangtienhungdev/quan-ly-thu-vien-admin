import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationWrapperProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

const PaginationWrapper = ({
	currentPage,
	totalPages,
	onPageChange,
	className,
}: PaginationWrapperProps) => {
	if (totalPages <= 1) return null;

	const getVisiblePages = () => {
		const delta = 2; // Số trang hiển thị xung quanh trang hiện tại
		const range = [];
		const rangeWithDots = [];

		for (
			let i = Math.max(2, currentPage - delta);
			i <= Math.min(totalPages - 1, currentPage + delta);
			i++
		) {
			range.push(i);
		}

		if (currentPage - delta > 2) {
			rangeWithDots.push(1, '...');
		} else {
			rangeWithDots.push(1);
		}

		rangeWithDots.push(...range);

		if (currentPage + delta < totalPages - 1) {
			rangeWithDots.push('...', totalPages);
		} else {
			rangeWithDots.push(totalPages);
		}

		return rangeWithDots;
	};

	const visiblePages = getVisiblePages();

	return (
		<Pagination className={className}>
			<PaginationContent>
				{/* Previous button */}
				<PaginationItem>
					<PaginationPrevious
						onClick={() => onPageChange(currentPage - 1)}
						className={
							currentPage <= 1
								? 'pointer-events-none opacity-50'
								: 'cursor-pointer'
						}
					/>
				</PaginationItem>

				{/* Page numbers */}
				{visiblePages.map((page, index) => (
					<PaginationItem key={index}>
						{page === '...' ? (
							<PaginationEllipsis />
						) : (
							<PaginationLink
								isActive={currentPage === page}
								onClick={() => onPageChange(page as number)}
								className="cursor-pointer"
							>
								{page}
							</PaginationLink>
						)}
					</PaginationItem>
				))}

				{/* Next button */}
				<PaginationItem>
					<PaginationNext
						onClick={() => onPageChange(currentPage + 1)}
						className={
							currentPage >= totalPages
								? 'pointer-events-none opacity-50'
								: 'cursor-pointer'
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export default PaginationWrapper;
