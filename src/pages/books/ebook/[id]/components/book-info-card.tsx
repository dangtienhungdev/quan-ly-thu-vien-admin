import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface BookInfoCardProps {
	book: any;
}

export function BookInfoCard({ book }: BookInfoCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<FileText className="h-5 w-5" />
					<span>Thông tin sách</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 className="font-semibold text-lg">{book?.title}</h3>
						<p className="text-muted-foreground">ISBN: {book?.isbn}</p>
						{book?.description && (
							<p className="text-sm mt-2">{book.description}</p>
						)}
					</div>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Tác giả:</span>
							<span>
								{book?.authors
									?.map((author) => author.author_name)
									.join(', ') || 'Chưa có'}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Thể loại:</span>
							<span>{book?.category?.category_name || 'Chưa có'}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Nhà xuất bản:</span>
							<span>{book?.publisher?.publisherName || 'Chưa có'}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Năm xuất bản:</span>
							<span>{book?.publish_year}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
