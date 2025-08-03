import { UploadsAPI } from '@/apis/uploads';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { CreateEBookRequest, Upload } from '@/types';
import { FileText, Upload as UploadIcon, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface CreateEBookDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	bookId: string;
	bookTitle?: string;
	onSubmit: (data: CreateEBookRequest) => void;
	isLoading?: boolean;
}

export function CreateEBookDialog({
	open,
	onOpenChange,
	bookId,
	bookTitle,
	onSubmit,
	isLoading = false,
}: CreateEBookDialogProps) {
	const [formData, setFormData] = useState({
		file_path: '',
		file_size: 0,
		file_format: 'PDF',
	});
	const [uploadedFile, setUploadedFile] = useState<Upload | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			// Auto-detect format from file extension
			const extension = file.name.split('.').pop()?.toUpperCase();
			if (extension) {
				setFormData((prev) => ({
					...prev,
					file_format:
						extension === 'PDF'
							? 'PDF'
							: extension === 'EPUB'
							? 'EPUB'
							: extension === 'MOBI'
							? 'MOBI'
							: extension === 'AZW'
							? 'AZW'
							: extension === 'TXT'
							? 'TXT'
							: extension === 'DOCX'
							? 'DOCX'
							: 'PDF',
				}));
			}
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			toast.error('Vui lòng chọn file để upload');
			return;
		}

		setIsUploading(true);
		try {
			const formData = new FormData();
			formData.append('file', selectedFile);

			const uploadResult = await UploadsAPI.upload(formData);
			setUploadedFile(uploadResult);

			// Update form data with uploaded file info
			setFormData((prev) => ({
				...prev,
				file_path: uploadResult.filePath,
				file_size: uploadResult.fileSize,
			}));

			toast.success('Upload file thành công!');
		} catch (error: any) {
			toast.error(error.message || 'Có lỗi xảy ra khi upload file');
		} finally {
			setIsUploading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!uploadedFile) {
			toast.error('Vui lòng upload file trước khi tạo ebook');
			return;
		}

		onSubmit({
			book_id: bookId,
			...formData,
		});
	};

	const handleInputChange = (field: string, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const resetForm = () => {
		setFormData({
			file_path: '',
			file_size: 0,
			file_format: 'PDF',
		});
		setUploadedFile(null);
		setSelectedFile(null);
	};

	const handleCancel = () => {
		resetForm();
		onOpenChange(false);
	};

	const removeSelectedFile = () => {
		setSelectedFile(null);
		setUploadedFile(null);
		setFormData((prev) => ({
			...prev,
			file_path: '',
			file_size: 0,
		}));
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Tạo EBook mới</DialogTitle>
					<DialogDescription>
						Thêm phiên bản ebook cho sách "{bookTitle}"
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* File Upload Section */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="file_upload">Chọn file để upload</Label>
							<div className="flex items-center space-x-2">
								<Input
									id="file_upload"
									type="file"
									accept=".pdf,.epub,.mobi,.azw,.txt,.docx"
									onChange={handleFileSelect}
									disabled={isUploading || isLoading}
								/>
								{selectedFile && (
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={removeSelectedFile}
										disabled={isUploading || isLoading}
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						</div>

						{/* Selected File Info */}
						{selectedFile && (
							<div className="p-3 border rounded-lg bg-gray-50">
								<div className="flex items-center space-x-2">
									<FileText className="h-4 w-4 text-blue-500" />
									<span className="font-medium">{selectedFile.name}</span>
								</div>
								<p className="text-sm text-gray-600 mt-1">
									Kích thước: {formatFileSize(selectedFile.size)}
								</p>
								{!uploadedFile && (
									<Button
										type="button"
										onClick={handleUpload}
										disabled={isUploading || isLoading}
										className="mt-2"
									>
										{isUploading ? (
											<>Đang upload...</>
										) : (
											<>
												<UploadIcon className="mr-2 h-4 w-4" />
												Upload File
											</>
										)}
									</Button>
								)}
							</div>
						)}

						{/* Uploaded File Info */}
						{uploadedFile && (
							<div className="p-3 border rounded-lg bg-green-50 border-green-200">
								<div className="flex items-center space-x-2">
									<FileText className="h-4 w-4 text-green-500" />
									<span className="font-medium text-green-700">
										✓ File đã upload thành công
									</span>
								</div>
								<div className="text-sm text-green-600 mt-1 space-y-1">
									<p>Tên file: {uploadedFile.originalName}</p>
									<p>Đường dẫn: {uploadedFile.filePath}</p>
									<p>Kích thước: {formatFileSize(uploadedFile.fileSize)}</p>
									<p>Định dạng: {uploadedFile.mimeType}</p>
								</div>
							</div>
						)}
					</div>

					{/* Format Selection */}
					<div className="space-y-2">
						<Label htmlFor="file_format">Định dạng</Label>
						<Select
							value={formData.file_format}
							onValueChange={(value) => handleInputChange('file_format', value)}
							disabled={isUploading || isLoading}
						>
							<SelectTrigger>
								<SelectValue placeholder="Chọn định dạng" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PDF">PDF</SelectItem>
								<SelectItem value="EPUB">EPUB</SelectItem>
								<SelectItem value="MOBI">MOBI</SelectItem>
								<SelectItem value="AZW">AZW</SelectItem>
								<SelectItem value="TXT">TXT</SelectItem>
								<SelectItem value="DOCX">DOCX</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex justify-end space-x-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={isUploading || isLoading}
						>
							Hủy
						</Button>
						<Button
							type="submit"
							disabled={isUploading || isLoading || !uploadedFile}
						>
							{isLoading ? 'Đang tạo...' : 'Tạo EBook'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
