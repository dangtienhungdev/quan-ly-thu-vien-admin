import { memo } from 'react';

interface LocationsEmptyProps {
	hasSearch: boolean;
}

export const LocationsEmpty = memo(({ hasSearch }: LocationsEmptyProps) => {
	return (
		<div className="text-center py-8 text-muted-foreground">
			{hasSearch ? 'Không tìm thấy vị trí nào' : 'Chưa có vị trí nào'}
		</div>
	);
});

LocationsEmpty.displayName = 'LocationsEmpty';
