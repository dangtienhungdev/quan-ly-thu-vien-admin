import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
	onCreateClick: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onCreateClick }) => {
	return (
		<div className="flex justify-between items-center">
			<div>
				<h1 className="text-3xl font-bold">Quản lý Mượn Trả</h1>
				<p className="text-muted-foreground">
					Theo dõi và quản lý các giao dịch mượn trả sách trong thư viện
				</p>
			</div>
			<Button onClick={onCreateClick}>
				<Plus className="mr-2 h-4 w-4" />
				Tạo Giao dịch Mượn
			</Button>
		</div>
	);
};
