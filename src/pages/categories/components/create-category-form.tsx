import type { Category, CreateCategoryRequest } from '@/types/categories';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createCategorySchema = z.object({
	category_name: z
		.string()
		.min(1, 'Tên danh mục là bắt buộc')
		.max(255, 'Tên danh mục tối đa 255 ký tự'),
	description: z.string().optional(),
	parent_id: z.string().optional(),
});

type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

interface CreateCategoryFormProps {
	onSubmit: (data: CreateCategoryRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
	mainCategories?: Category[];
}

const CreateCategoryForm = ({
	onSubmit,
	onCancel,
	isLoading = false,
	mainCategories = [],
}: CreateCategoryFormProps) => {
	const form = useForm<CreateCategoryFormData>({
		resolver: zodResolver(createCategorySchema),
		defaultValues: {
			category_name: '',
			description: '',
			parent_id: '',
		},
	});

	const handleSubmit = (data: CreateCategoryFormData) => {
		onSubmit({
			...data,
			parent_id: data.parent_id || undefined,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="category_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên danh mục</FormLabel>
							<FormControl>
								<Input placeholder="Nhập tên danh mục" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="parent_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Danh mục cha (tùy chọn)</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Chọn danh mục cha (để trống nếu là danh mục chính)" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="">Không có (danh mục chính)</SelectItem>
									{mainCategories.map((category) => (
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
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mô tả (tùy chọn)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Nhập mô tả về danh mục"
									className="resize-none"
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
					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Đang tạo...' : 'Tạo danh mục'}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default CreateCategoryForm;
