import { Alert, AlertDescription } from '@/components/ui/alert';

import { Button } from '@/components/ui/button';
import { IconRefresh } from '@tabler/icons-react';
import { memo } from 'react';

interface AuthorsErrorStateProps {
	error: Error | null;
	onRetry: () => void;
}

const AuthorsErrorState = memo<AuthorsErrorStateProps>(({ error, onRetry }) => {
	return (
		<div className="container mx-auto py-6">
			<Alert variant="destructive">
				<AlertDescription>
					Failed to load authors: {error?.message || 'Unknown error'}
				</AlertDescription>
			</Alert>
			<Button onClick={onRetry} className="mt-4">
				<IconRefresh className="mr-2 h-4 w-4" />
				Retry
			</Button>
		</div>
	);
});

AuthorsErrorState.displayName = 'AuthorsErrorState';

export default AuthorsErrorState;
