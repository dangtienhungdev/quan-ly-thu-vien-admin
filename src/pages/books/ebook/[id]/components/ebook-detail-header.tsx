import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EBookDetailHeaderProps {
	title?: string;
}

export function EBookDetailHeader({ title }: EBookDetailHeaderProps) {
	const navigate = useNavigate();

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center space-x-4">
				<Button variant="outline" size="sm" onClick={() => navigate('/books')}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Quay lại
				</Button>
				<div>
					<h1 className="text-3xl font-bold">Chi tiết Sách Điện tử</h1>
					<p className="text-muted-foreground">
						Quản lý các phiên bản ebook của sách
					</p>
				</div>
			</div>
		</div>
	);
}
