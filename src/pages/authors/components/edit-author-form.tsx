import type { Author, UpdateAuthorRequest } from '@/types/authors';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const updateAuthorSchema = z.object({
	author_name: z
		.string()
		.min(1, 'Tên tác giả là bắt buộc')
		.max(255, 'Tên tác giả tối đa 255 ký tự'),
	bio: z.string().optional(),
	nationality: z
		.string()
		.min(1, 'Quốc tịch là bắt buộc')
		.max(100, 'Quốc tịch tối đa 100 ký tự'),
});

type UpdateAuthorFormData = z.infer<typeof updateAuthorSchema>;

interface EditAuthorFormProps {
	author: Author;
	onSubmit: (data: UpdateAuthorRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

const EditAuthorForm = ({
	author,
	onSubmit,
	onCancel,
	isLoading = false,
}: EditAuthorFormProps) => {
	const form = useForm<UpdateAuthorFormData>({
		resolver: zodResolver(updateAuthorSchema),
		defaultValues: {
			author_name: author.author_name,
			bio: author.bio || '',
			nationality: author.nationality,
		},
	});

	const handleSubmit = (data: UpdateAuthorFormData) => {
		onSubmit({
			...data,
			bio: data.bio || undefined,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="author_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên tác giả *</FormLabel>
							<FormControl>
								<Input placeholder="Nhập tên tác giả" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="nationality"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Quốc tịch *</FormLabel>
							<FormControl>
								<Input placeholder="Nhập quốc tịch" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="bio"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tiểu sử</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Nhập tiểu sử về tác giả"
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

export default EditAuthorForm;
