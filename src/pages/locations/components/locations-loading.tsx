import { IconLoader2 } from '@tabler/icons-react';
import { memo } from 'react';

export const LocationsLoading = memo(() => {
	return (
		<div className="flex items-center justify-center py-8">
			<IconLoader2 className="h-6 w-6 animate-spin" />
			<span className="ml-2">Đang tải...</span>
		</div>
	);
});

LocationsLoading.displayName = 'LocationsLoading';
