import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

interface BookCategoriesErrorStateProps {
	error: unknown;
	onRetry: () => void;
}

export default function BookCategoriesErrorState({
	error,
	onRetry,
}: BookCategoriesErrorStateProps) {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Quản lý Thể loại chi tiết</h1>
					<p className="text-muted-foreground">
						Tổ chức danh mục thể loại có phân cấp cha/con
					</p>
				</div>
			</div>

			{/* Error Card */}
			<Card>
				<CardContent className="py-12">
					<div className="flex flex-col items-center justify-center space-y-4">
						<AlertTriangle className="h-12 w-12 text-destructive" />
						<div className="text-center space-y-2">
							<h3 className="text-lg font-semibold">Có lỗi xảy ra</h3>
							<p className="text-muted-foreground">
								Không thể tải danh sách thể loại. Vui lòng thử lại.
							</p>
							{error && (
								<Alert variant="destructive" className="mt-4">
									<AlertDescription>
										{(error as Error)?.message || 'Lỗi không xác định'}
									</AlertDescription>
								</Alert>
							)}
						</div>
						<Button onClick={onRetry} variant="outline">
							<RefreshCw className="mr-2 h-4 w-4" />
							Thử lại
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
