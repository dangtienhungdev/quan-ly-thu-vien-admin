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
import type {
	BookCategory,
	UpdateBookCategoryRequest,
} from '@/types/book-categories';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const updateSchema = z.object({
	name: z
		.string()
		.min(1, 'Tên thể loại là bắt buộc')
		.max(100, 'Tối đa 100 ký tự'),
	parent_id: z.string().optional(),
});

type UpdateFormData = z.infer<typeof updateSchema>;

interface EditBookCategoryFormProps {
	category: BookCategory;
	onSubmit: (data: UpdateBookCategoryRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
	categories?: BookCategory[];
}

const EditBookCategoryForm = ({
	category,
	onSubmit,
	onCancel,
	isLoading = false,
	categories = [],
}: EditBookCategoryFormProps) => {
	const form = useForm<UpdateFormData>({
		resolver: zodResolver(updateSchema),
		defaultValues: {
			name: category.name,
			parent_id: category.parent_id ?? 'none',
		},
	});

	const handleSubmit = (data: UpdateFormData) => {
		onSubmit({
			name: data.name,
			parent_id: data.parent_id === 'none' ? null : data.parent_id,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên thể loại *</FormLabel>
							<FormControl>
								<Input placeholder="Nhập tên thể loại" {...field} />
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
							<FormLabel>Thể loại cha (tùy chọn)</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Chọn thể loại cha" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="none">Không có (gốc)</SelectItem>
									{categories
										.filter((c) => c.id !== category.id)
										.map((c) => (
											<SelectItem key={c.id} value={c.id}>
												{c.name}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
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

export default EditBookCategoryForm;
