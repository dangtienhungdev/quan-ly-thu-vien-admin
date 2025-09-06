import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import type { Author, UpdateAuthorRequest } from '@/types/authors';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { countries } from '@/data/countries';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const updateAuthorSchema = z.object({
	author_name: z
		.string()
		.min(1, 'Tên tác giả là bắt buộc')
		.max(255, 'Tên tác giả tối đa 255 ký tự'),
	bio: z.string().optional(),
	nationality: z.string().min(1, 'Quốc tịch là bắt buộc'),
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
	// Find country code from country name
	const getCountryCode = (countryName: string) => {
		const country = countries.find((c) => c.label === countryName);
		return country ? country.value : '';
	};

	const form = useForm<UpdateAuthorFormData>({
		resolver: zodResolver(updateAuthorSchema),
		defaultValues: {
			author_name: author.author_name,
			bio: author.bio || '',
			nationality: getCountryCode(author.nationality),
		},
	});

	const handleSubmit = (data: UpdateAuthorFormData) => {
		// Convert country code to country name
		const selectedCountry = countries.find(
			(country) => country.value === data.nationality
		);
		const nationalityName = selectedCountry
			? selectedCountry.label
			: data.nationality;

		onSubmit({
			...data,
			nationality: nationalityName,
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
								<Combobox
									options={countries}
									value={field.value}
									onValueChange={field.onChange}
									placeholder="Chọn quốc tịch..."
									searchPlaceholder="Tìm kiếm quốc gia..."
									emptyText="Không tìm thấy quốc gia nào"
									disabled={isLoading}
								/>
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
