import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CreateGradeLevelRequest } from '@/types/grade-levels';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const createGradeLevelSchema = z.object({
	name: z
		.string()
		.min(1, 'Tên khối lớp là bắt buộc')
		.max(50, 'Tối đa 50 ký tự'),
	description: z.string().optional(),
	order: z.number().int('Thứ tự phải là số nguyên').min(0, 'Thứ tự phải >= 0'),
});

type CreateGradeLevelFormData = {
	name: string;
	description?: string;
	order: number;
};

interface CreateGradeLevelFormProps {
	onSubmit: (data: CreateGradeLevelRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

const CreateGradeLevelForm = ({
	onSubmit,
	onCancel,
	isLoading = false,
}: CreateGradeLevelFormProps) => {
	const form = useForm<CreateGradeLevelFormData>({
		resolver: zodResolver(createGradeLevelSchema),
		defaultValues: {
			name: '',
			description: '',
			order: 0,
		},
	});

	const handleSubmit = (data: CreateGradeLevelFormData) => {
		onSubmit({
			...data,
			description: data.description || undefined,
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
							<FormLabel>Tên khối lớp *</FormLabel>
							<FormControl>
								<Input placeholder="Nhập tên khối lớp" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="order"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thứ tự (mặc định 0)</FormLabel>
							<FormControl>
								<Input
									type="number"
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
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mô tả</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Mô tả khối lớp"
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
						{isLoading ? 'Đang tạo...' : 'Tạo khối lớp'}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default CreateGradeLevelForm;
