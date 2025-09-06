import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { Skeleton } from '@/components/ui/skeleton';
import { memo } from 'react';

const AuthorsLoadingSkeleton = memo(() => {
	return (
		<div className="container mx-auto py-6">
			<Card>
				<CardHeader>
					<Skeleton className="h-8 w-48" />
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
});

AuthorsLoadingSkeleton.displayName = 'AuthorsLoadingSkeleton';

export default AuthorsLoadingSkeleton;
