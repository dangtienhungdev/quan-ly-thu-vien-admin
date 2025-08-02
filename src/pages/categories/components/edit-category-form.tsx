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
import type { Category, UpdateCategoryRequest } from '@/types/categories';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const updateCategorySchema = z.object({
	category_name: z
		.string()
		.min(1, 'Tên danh mục là bắt buộc')
		.max(255, 'Tên danh mục tối đa 255 ký tự'),
	description: z.string().optional(),
	parent_id: z.string().optional(),
});

type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;

interface EditCategoryFormProps {
	category: Category;
	onSubmit: (data: UpdateCategoryRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
	mainCategories?: Category[];
}

const EditCategoryForm = ({
	category,
	onSubmit,
	onCancel,
	isLoading = false,
	mainCategories = [],
}: EditCategoryFormProps) => {
	const form = useForm<UpdateCategoryFormData>({
		resolver: zodResolver(updateCategorySchema),
		defaultValues: {
			category_name: category.category_name,
			description: category.description || '',
			parent_id: category.parent_id || 'none',
		},
	});

	const handleSubmit = (data: UpdateCategoryFormData) => {
		onSubmit({
			...data,
			parent_id: data.parent_id === 'none' ? undefined : data.parent_id,
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
									<SelectItem value="none">Không có (danh mục chính)</SelectItem>
									{mainCategories
										.filter((cat) => cat.id !== category.id) // Không cho phép chọn chính nó làm parent
										.map((cat) => (
											<SelectItem key={cat.id} value={cat.id}>
												{cat.category_name}
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
						{isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default EditCategoryForm;
