import { Alert, AlertDescription } from '@/components/ui/alert';

import { memo } from 'react';

interface LocationsErrorProps {
	error: Error;
}

export const LocationsError = memo(({ error }: LocationsErrorProps) => {
	return (
		<div className="container mx-auto p-6">
			<Alert variant="destructive">
				<AlertDescription>
					Có lỗi xảy ra khi tải dữ liệu vị trí: {error.message}
				</AlertDescription>
			</Alert>
		</div>
	);
});

LocationsError.displayName = 'LocationsError';
