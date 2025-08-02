import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUploadImage } from '@/hooks/images';
import type { Author } from '@/types/authors';
import type { CreateBookRequest } from '@/types/books';
import type { Category } from '@/types/categories';
import type { Publisher } from '@/types/publishers';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconUpload, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const createBookSchema = z.object({
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
	physical_type: z.enum(['library_use', 'borrowable']),
	publisher_id: z.string().min(1, 'Nhà xuất bản là bắt buộc'),
	category_id: z.string().min(1, 'Thể loại là bắt buộc'),
	author_ids: z.array(z.string()).optional(),
});

type CreateBookFormData = z.infer<typeof createBookSchema>;

interface CreateBookFormProps {
	onSubmit: (data: CreateBookRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
	categories?: Category[];
	publishers?: Publisher[];
	authors?: Author[];
}

const CreateBookForm = ({
	onSubmit,
	onCancel,
	isLoading = false,
	categories = [],
	publishers = [],
	authors = [],
}: CreateBookFormProps) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>('');
	console.log('🚀 ~ CreateBookForm ~ previewUrl:', previewUrl);

	const { uploadImage, isUploading: isUploadingImage } = useUploadImage({
		onSuccess: (image) => {
			form.setValue('cover_image', image.cloudinaryUrl);
			setPreviewUrl(image.cloudinaryUrl);
			setSelectedFile(null);
			// Clear any validation errors for cover_image
			form.clearErrors('cover_image');
		},
		onError: (error) => {
			// Set validation error for cover_image
			form.setError('cover_image', {
				type: 'manual',
				message: 'Upload ảnh thất bại. Vui lòng thử lại.',
			});
		},
	});

	const form = useForm<CreateBookFormData>({
		resolver: zodResolver(createBookSchema),
		defaultValues: {
			title: '',
			isbn: '',
			publish_year: new Date().getFullYear(),
			edition: '1st',
			description: '',
			cover_image: '',
			language: 'Tiếng Việt',
			page_count: 1,
			book_type: 'physical',
			physical_type: 'borrowable',
			publisher_id: '',
			category_id: '',
			author_ids: [],
		},
	});

	const handleSubmit = (data: CreateBookFormData) => {
		// Check if cover image is uploaded
		if (!data.cover_image) {
			form.setError('cover_image', {
				type: 'manual',
				message: 'Vui lòng upload ảnh bìa trước khi tạo sách.',
			});
			return;
		}

		onSubmit({
			...data,
			description: data.description || undefined,
			author_ids: data.author_ids || undefined,
		});
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
			console.log('🔄 Starting upload for file:', selectedFile.name);
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
								<Input placeholder="Nhập tên sách" {...field} />
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
								<Input placeholder="Nhập ISBN" {...field} />
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
									{/* <Input
										placeholder="Hoặc nhập URL ảnh bìa"
										{...field}
										onChange={(e) => {
											field.onChange(e.target.value);
											setPreviewUrl(e.target.value);
										}}
									/> */}
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
						{isLoading ? 'Đang tạo...' : 'Tạo sách'}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default CreateBookForm;
