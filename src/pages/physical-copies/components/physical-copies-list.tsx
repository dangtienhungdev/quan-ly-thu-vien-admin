import type { PhysicalCopy } from '@/types';
import { PhysicalCopyCard } from './physical-copy-card';
import { memo } from 'react';

interface PhysicalCopiesListProps {
	copies: PhysicalCopy[];
	isLoading: boolean;
	onEdit: (copy: PhysicalCopy) => void;
	onDelete: (copy: PhysicalCopy) => void;
	onUpdateStatus: (copy: PhysicalCopy) => void;
	getStatusColor: (status: any) => string;
	getConditionColor: (condition: any) => string;
	getStatusIcon: (status: any) => React.ReactNode;
	formatCurrency: (amount: number) => string;
}

export const PhysicalCopiesList = memo<PhysicalCopiesListProps>(
	({
		copies,
		isLoading,
		onEdit,
		onDelete,
		onUpdateStatus,
		getStatusColor,
		getConditionColor,
		getStatusIcon,
		formatCurrency,
	}) => {
		if (isLoading) {
			return <div className="text-center py-8">Đang tải...</div>;
		}

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{copies.map((copy) => (
					<PhysicalCopyCard
						key={copy.id}
						copy={copy}
						onEdit={onEdit}
						onDelete={onDelete}
						onUpdateStatus={onUpdateStatus}
						getStatusColor={getStatusColor}
						getConditionColor={getConditionColor}
						getStatusIcon={getStatusIcon}
						formatCurrency={formatCurrency}
					/>
				))}
			</div>
		);
	}
);

PhysicalCopiesList.displayName = 'PhysicalCopiesList';
