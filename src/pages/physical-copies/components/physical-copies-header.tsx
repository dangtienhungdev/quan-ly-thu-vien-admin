import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { memo } from 'react';

interface PhysicalCopiesHeaderProps {
	onCreateClick: () => void;
}

export const PhysicalCopiesHeader = memo<PhysicalCopiesHeaderProps>(
	({ onCreateClick }) => {
		return (
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Quản lý Bản sao Vật lý</h1>
					<p className="text-muted-foreground">
						Quản lý và theo dõi các bản sao sách vật lý trong thư viện
					</p>
				</div>
				<Button onClick={onCreateClick}>
					<Plus className="mr-2 h-4 w-4" />
					Thêm Bản sao
				</Button>
			</div>
		);
	}
);

PhysicalCopiesHeader.displayName = 'PhysicalCopiesHeader';
