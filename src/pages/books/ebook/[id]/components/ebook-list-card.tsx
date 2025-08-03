import { UploadsAPI } from '@/apis/uploads';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EBook } from '@/types';
import { Calendar, Download, FileText, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface EBookListCardProps {
	ebooks: EBook[];
	onCreateNew: () => void;
	onDownload: (ebookId: string) => void;
}

export function EBookListCard({
	ebooks,
	onCreateNew,
	onDownload,
}: EBookListCardProps) {
	const hasEbooks = ebooks.length > 0;
	const [downloadingEbookId, setDownloadingEbookId] = useState<string | null>(
		null
	);

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	const getFormatColor = (format: string) => {
		const colors: Record<string, string> = {
			PDF: 'bg-red-100 text-red-800',
			EPUB: 'bg-blue-100 text-blue-800',
			MOBI: 'bg-green-100 text-green-800',
			AZW: 'bg-purple-100 text-purple-800',
			TXT: 'bg-gray-100 text-gray-800',
			DOCX: 'bg-orange-100 text-orange-800',
		};
		return colors[format] || 'bg-gray-100 text-gray-800';
	};

	// Extract slug from file_path: "files/filename.ext" -> "filename"
	const extractSlugFromFilePath = (filePath: string): string => {
		// Remove "files/" prefix and file extension
		const fileName = filePath.replace('files/', '');
		const slug = fileName.split('.').slice(0, -1).join('.');
		return slug;
	};

	// Download file with the specified workflow
	const handleDownload = async (ebook: EBook) => {
		setDownloadingEbookId(ebook.id);

		try {
			// Step 1: Extract slug from file_path
			const slug = extractSlugFromFilePath(ebook.file_path);

			// Step 2: Call API to get upload info by slug
			const uploadInfo = await UploadsAPI.getBySlug(slug);

			// Step 3: Download file using the ID
			const blob = await UploadsAPI.downloadById(uploadInfo.id);

			// Step 4: Create download link and trigger download
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download =
				uploadInfo.originalName || `ebook.${ebook.file_format.toLowerCase()}`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			// Step 5: Update download count
			onDownload(ebook.id);

			toast.success('Tải xuống thành công!');
		} catch (error: any) {
			console.error('Download error:', error);
			toast.error(error.message || 'Có lỗi xảy ra khi tải xuống file');
		} finally {
			setDownloadingEbookId(null);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Download className="h-5 w-5" />
						<span>Danh sách EBook ({ebooks.length})</span>
					</div>
					{!hasEbooks && (
						<Button onClick={onCreateNew}>
							<Plus className="mr-2 h-4 w-4" />
							Tạo EBook mới
						</Button>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{!hasEbooks ? (
					<div className="text-center py-8">
						<FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">Chưa có ebook nào</h3>
						<p className="text-muted-foreground mb-4">
							Sách này chưa có phiên bản ebook. Hãy tạo ebook đầu tiên.
						</p>
						<Button onClick={onCreateNew}>
							<Plus className="mr-2 h-4 w-4" />
							Tạo EBook mới
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						{ebooks.map((ebook) => (
							<Card
								key={ebook.id}
								className="hover:shadow-md transition-shadow"
							>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
												<Badge className={getFormatColor(ebook.file_format)}>
													{ebook.file_format}
												</Badge>
												<span className="text-sm text-muted-foreground">
													{formatFileSize(ebook.file_size)}
												</span>
											</div>
											<div className="space-y-1">
												<p className="font-medium">
													Đường dẫn: {ebook.file_path}
												</p>
												<div className="flex items-center space-x-4 text-sm text-muted-foreground">
													<span className="flex items-center">
														<Download className="mr-1 h-3 w-3" />
														{ebook.download_count} lượt tải
													</span>
													<span className="flex items-center">
														<Calendar className="mr-1 h-3 w-3" />
														{new Date(ebook.created_at).toLocaleDateString(
															'vi-VN'
														)}
													</span>
												</div>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleDownload(ebook)}
												disabled={downloadingEbookId === ebook.id}
											>
												<Download className="mr-2 h-4 w-4" />
												{downloadingEbookId === ebook.id
													? 'Đang tải...'
													: 'Tải xuống'}
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
