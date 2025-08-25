import type { Book, UpdateBookRequest } from '@/types/books';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { IconUpload, IconX } from '@tabler/icons-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

import type { Author } from '@/types/authors';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types/categories';
import { Input } from '@/components/ui/input';
import type { Publisher } from '@/types/publishers';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAllBookCategories } from '@/hooks/book-categories';
import { useAllGradeLevels } from '@/hooks/grade-levels';
import { useForm } from 'react-hook-form';
import { useUploadImage } from '@/hooks/images';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const updateBookSchema = z.object({
	title: z
		.string()
		.min(1, 'Tên sách là bắt buộc')
		.max(255, 'Tên sách tối đa 255 ký tự'),
	isbn: z.string().min(1, 'ISBN là bắt buộc').max(20, 'ISBN tối đa 20 ký tự'),
	publish_year: z
		.number()
		.min(1900, 'Năm xuất bản phải từ 1900')
		.max(
			new Date().getFullYear() + 1,
			'Năm xuất bản không được lớn hơn năm hiện tại'
		),
	edition: z
		.string()
		.min(1, 'Phiên bản là bắt buộc')
		.max(50, 'Phiên bản tối đa 50 ký tự'),
	description: z.string().optional(),
	cover_image: z
		.string()
		.min(1, 'Ảnh bìa là bắt buộc')
		.url('URL ảnh bìa không hợp lệ'),
	language: z
		.string()
		.min(1, 'Ngôn ngữ là bắt buộc')
		.max(50, 'Ngôn ngữ tối đa 50 ký tự'),
	page_count: z
		.number()
		.min(1, 'Số trang phải lớn hơn 0')
		.max(10000, 'Số trang tối đa 10000'),
	book_type: z.enum(['physical', 'ebook']),
	physical_type: z.enum(['library_use', 'borrowable']).optional(), // Làm optional vì ebook không cần
	publisher_id: z.string().min(1, 'Nhà xuất bản là bắt buộc'),
	category_id: z.string().min(1, 'Thể loại là bắt buộc'),
	author_ids: z.array(z.string()).optional(),
	main_category_id: z.string().optional(),
	grade_level_ids: z.array(z.string()).optional(),
});

type UpdateBookFormData = {
	title: string;
	isbn: string;
	publish_year: number;
	edition: string;
	description?: string;
	cover_image: string;
	language: string;
	page_count: number;
	book_type: 'physical' | 'ebook';
	physical_type?: 'library_use' | 'borrowable'; // Làm optional để phù hợp với schema
	publisher_id: string;
	category_id: string;
	author_ids?: string[];
	main_category_id?: string;
	grade_level_ids?: string[];
};

interface EditBookFormProps {
	book: Book;
	onSubmit: (data: UpdateBookRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
	categories?: Category[];
	publishers?: Publisher[];
	authors?: Author[];
}

const EditBookForm = ({
	book,
	onSubmit,
	onCancel,
	isLoading = false,
	categories = [],
	publishers = [],
	authors = [],
}: EditBookFormProps) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>('');
	const { bookCategories } = useAllBookCategories();
	const { gradeLevels } = useAllGradeLevels();

	const { uploadImage, isUploading: isUploadingImage } = useUploadImage({
		onSuccess: (image) => {
			form.setValue('cover_image', image.cloudinaryUrl);
			setPreviewUrl(image.cloudinaryUrl);
			setSelectedFile(null);
			// Clear any validation errors for cover_image
			form.clearErrors('cover_image');
		},
		onError: () => {
			// Set validation error for cover_image
			form.setError('cover_image', {
				type: 'manual',
				message: 'Có lỗi xảy ra khi tải ảnh lên',
			});
		},
	});

	const form = useForm<UpdateBookFormData>({
		resolver: zodResolver(updateBookSchema),
		defaultValues: {
			title: book.title,
			isbn: book.isbn,
			publish_year: book.publish_year,
			edition: book.edition,
			description: book.description || '',
			cover_image: book.cover_image || '',
			language: book.language,
			page_count: book.page_count,
			book_type: book.book_type,
			physical_type: book.physical_type || 'borrowable', // Đảm bảo có giá trị mặc định
			publisher_id: book.publisher_id,
			category_id: book.category_id,
			author_ids: book.authors?.map((author) => author.id) || [],
			main_category_id: (book as any).main_category_id || 'none',
			grade_level_ids: (book as any).grade_level_ids || [],
		},
	});

	// Reset form when book changes
	useEffect(() => {
		// Đảm bảo book có đầy đủ dữ liệu cần thiết
		if (!book || !book.id) {
			console.error('❌ EditBookForm: Invalid book data:', book);
			return;
		}

		const formData = {
			title: book.title || '',
			isbn: book.isbn || '',
			publish_year: book.publish_year || new Date().getFullYear(),
			edition: book.edition || '',
			description: book.description || '',
			cover_image: book.cover_image || '',
			language: book.language || '',
			page_count: book.page_count || 0,
			book_type: book.book_type || 'physical',
			physical_type: book.physical_type || 'borrowable',
			publisher_id: book.publisher_id || '',
			category_id: book.category_id || '',
			author_ids: book.authors?.map((author) => author.id) || [],
			main_category_id: (book as any).main_category_id || 'none',
			grade_level_ids: (book as any).grade_level_ids || [],
		};

		// Reset form với dữ liệu mới
		form.reset(formData);
		setPreviewUrl(book.cover_image || '');

		// Force re-render form fields
		setTimeout(() => {
			form.trigger(); // Trigger validation để đảm bảo form hiển thị đúng
		}, 100);
	}, [book, form]);

	const handleSubmit = (data: UpdateBookFormData) => {
		// Check if cover image is uploaded
		if (!data.cover_image) {
			form.setError('cover_image', {
				type: 'manual',
				message: 'Vui lòng upload ảnh bìa trước khi cập nhật sách.',
			});
			return;
		}

		const submitData = {
			...data,
			description: data.description || undefined,
			author_ids: data.author_ids || undefined,
			main_category_id:
				!data.main_category_id || data.main_category_id === ('none' as any)
					? null
					: data.main_category_id,
			grade_level_ids:
				data.grade_level_ids && data.grade_level_ids.length > 0
					? data.grade_level_ids
					: undefined,
			// Chỉ gửi physical_type nếu book_type là physical
			...(data.book_type === 'physical' && {
				physical_type: data.physical_type,
			}),
		};

		onSubmit(submitData);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};

	const handleUploadImage = () => {
		if (selectedFile) {
			uploadImage(selectedFile);
		} else {
			console.warn('⚠️ No file selected for upload');
			toast.error('Vui lòng chọn file ảnh trước khi upload');
		}
	};

	const handleRemoveImage = () => {
		setSelectedFile(null);
		setPreviewUrl('');
		form.setValue('cover_image', '');
	};

	const bookType = form.watch('book_type');

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên sách *</FormLabel>
							<FormControl>
								<Input
									placeholder="Nhập tên sách"
									className="w-full"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="isbn"
					render={({ field }) => (
						<FormItem>
							<FormLabel>ISBN *</FormLabel>
							<FormControl>
								<Input placeholder="Nhập ISBN" className="w-full" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="publish_year"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Năm xuất bản *</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="2024"
									className="w-full"
									{...field}
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="edition"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phiên bản *</FormLabel>
							<FormControl>
								<Input placeholder="1st" className="w-full" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="language"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ngôn ngữ *</FormLabel>
							<FormControl>
								<Input placeholder="Tiếng Việt" className="w-full" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="page_count"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Số trang *</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="300"
									className="w-full"
									{...field}
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="book_type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Loại sách *</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Chọn loại sách" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="physical">Sách vật lý</SelectItem>
									<SelectItem value="ebook">Sách điện tử</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{bookType === 'physical' && (
					<FormField
						control={form.control}
						name="physical_type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Loại vật lý *</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Chọn loại vật lý" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="borrowable">Có thể mượn</SelectItem>
										<SelectItem value="library_use">
											Chỉ đọc tại thư viện
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<FormField
					control={form.control}
					name="publisher_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nhà xuất bản *</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Chọn nhà xuất bản" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{publishers.map((publisher) => (
										<SelectItem key={publisher.id} value={publisher.id}>
											{publisher.publisherName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="category_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thể loại *</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Chọn thể loại" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											{category.category_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="author_ids"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tác giả</FormLabel>
							<Select
								onValueChange={(value) => {
									const currentIds = field.value || [];
									if (!currentIds.includes(value)) {
										field.onChange([...currentIds, value]);
									}
								}}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Chọn tác giả" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{authors.map((author) => (
										<SelectItem key={author.id} value={author.id}>
											{author.author_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{field.value && field.value.length > 0 && (
								<div className="mt-2 space-y-1">
									{field.value.map((authorId) => {
										const author = authors.find((a) => a.id === authorId);
										return (
											<div
												key={authorId}
												className="flex items-center justify-between bg-muted p-2 rounded"
											>
												<span className="text-sm">{author?.author_name}</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => {
														field.onChange(
															field.value?.filter((id) => id !== authorId)
														);
													}}
													className="h-6 w-6 p-0"
												>
													<IconX className="h-3 w-3" />
												</Button>
											</div>
										);
									})}
								</div>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Main Book Category (book-categories) */}
				<FormField
					control={form.control}
					name="main_category_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thể loại chính (tùy chọn)</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Chọn thể loại chính" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value={'none' as any}>Không chọn</SelectItem>
									{bookCategories?.map((bc) => (
										<SelectItem key={bc.id} value={bc.id}>
											{bc.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Grade Levels (multi-select) */}
				<FormField
					control={form.control}
					name="grade_level_ids"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Khối lớp (tùy chọn)</FormLabel>
							<Select
								onValueChange={(value) => {
									const list = field.value || [];
									if (!list.includes(value)) field.onChange([...list, value]);
								}}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Chọn khối lớp" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{gradeLevels?.map((g) => (
										<SelectItem key={g.id} value={g.id}>
											{g.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{field.value && field.value.length > 0 && (
								<div className="mt-2 space-y-1">
									{field.value.map((id) => {
										const gl = gradeLevels?.find((g) => g.id === id);
										return (
											<div
												key={id}
												className="flex items-center justify-between bg-muted p-2 rounded"
											>
												<span className="text-sm">{gl?.name}</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() =>
														field.onChange(field.value?.filter((x) => x !== id))
													}
													className="h-6 w-6 p-0"
												>
													<IconX className="h-3 w-3" />
												</Button>
											</div>
										);
									})}
								</div>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="cover_image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ảnh bìa *</FormLabel>
							<FormControl>
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<Input
											type="file"
											accept="image/*"
											onChange={handleFileChange}
											className="flex-1 w-full"
										/>
										{selectedFile && (
											<Button
												type="button"
												onClick={handleUploadImage}
												disabled={isUploadingImage}
												className="flex items-center space-x-1"
											>
												<IconUpload className="h-4 w-4" />
												{isUploadingImage ? 'Đang upload...' : 'Upload'}
											</Button>
										)}
										{(previewUrl || field.value) && (
											<Button
												type="button"
												variant="outline"
												onClick={handleRemoveImage}
												className="flex items-center space-x-1"
											>
												<IconX className="h-4 w-4" />
												Xóa
											</Button>
										)}
									</div>
									{(previewUrl || field.value) && (
										<div className="relative w-32 h-32 border rounded overflow-hidden">
											<img
												src={previewUrl || field.value}
												alt="Preview"
												className="w-full h-full object-cover"
											/>
										</div>
									)}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mô tả</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Nhập mô tả về sách"
									className="resize-none w-full"
									rows={4}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end space-x-2 pt-4">
					<Button type="button" variant="outline" onClick={onCancel}>
						Hủy
					</Button>
					<Button type="submit" disabled={isLoading || isUploadingImage}>
						{isLoading ? 'Đang cập nhật...' : 'Cập nhật sách'}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default EditBookForm;
