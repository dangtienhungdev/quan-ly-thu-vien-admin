import { Card, CardContent } from '@/components/ui/card';

import { Skeleton } from '@/components/ui/skeleton';

export default function BookCategoriesLoadingSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header Skeleton */}
			<div className="flex justify-between items-center">
				<div className="space-y-2">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-4 w-96" />
				</div>
				<Skeleton className="h-10 w-32" />
			</div>

			{/* Search Skeleton */}
			<div className="flex items-center space-x-2">
				<Skeleton className="h-10 w-80" />
				<Skeleton className="h-10 w-24" />
			</div>

			{/* Table Skeleton */}
			<Card>
				<CardContent>
					<div className="space-y-4">
						{/* Table Header */}
						<div className="flex space-x-4">
							<Skeleton className="h-10 flex-1" />
							<Skeleton className="h-10 flex-1" />
							<Skeleton className="h-10 flex-1" />
							<Skeleton className="h-10 w-32" />
						</div>
						{/* Table Rows */}
						{[...Array(5)].map((_, i) => (
							<div key={i} className="flex space-x-4">
								<Skeleton className="h-10 flex-1" />
								<Skeleton className="h-10 flex-1" />
								<Skeleton className="h-10 flex-1" />
								<Skeleton className="h-10 w-32" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Pagination Skeleton */}
			<div className="flex justify-center">
				<Skeleton className="h-10 w-64" />
			</div>
		</div>
	);
}
