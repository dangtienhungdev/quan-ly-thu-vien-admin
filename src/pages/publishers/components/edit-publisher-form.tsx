import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import type { Publisher, UpdatePublisherRequest } from '@/types/publishers';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const updatePublisherSchema = z.object({
	publisherName: z
		.string()
		.min(1, 'Tên nhà xuất bản là bắt buộc')
		.max(255, 'Tên nhà xuất bản tối đa 255 ký tự'),
	address: z.string().min(1, 'Địa chỉ là bắt buộc'),
	phone: z
		.string()
		.min(10, 'Số điện thoại tối thiểu 10 ký tự')
		.max(20, 'Số điện thoại tối đa 20 ký tự'),
	email: z
		.string()
		.email('Email không hợp lệ')
		.max(255, 'Email tối đa 255 ký tự'),
	website: z
		.string()
		.url('Website không hợp lệ')
		.max(255, 'Website tối đa 255 ký tự')
		.optional()
		.or(z.literal('')),
	description: z.string().optional(),
	country: z.string().max(100, 'Quốc gia tối đa 100 ký tự').optional(),
	establishedDate: z.string().optional(),
	isActive: z.boolean(),
});

type UpdatePublisherFormData = z.infer<typeof updatePublisherSchema>;

interface EditPublisherFormProps {
	publisher: Publisher;
	onSubmit: (data: UpdatePublisherRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

const EditPublisherForm = ({
	publisher,
	onSubmit,
	onCancel,
	isLoading = false,
}: EditPublisherFormProps) => {
	const form = useForm<UpdatePublisherFormData>({
		resolver: zodResolver(updatePublisherSchema),
		defaultValues: {
			publisherName: publisher.publisherName,
			address: publisher.address,
			phone: publisher.phone,
			email: publisher.email,
			website: publisher.website || '',
			description: publisher.description || '',
			country: publisher.country || '',
			establishedDate: publisher.establishedDate || '',
			isActive: publisher.isActive,
		},
	});

	const handleSubmit = (data: UpdatePublisherFormData) => {
		onSubmit({
			...data,
			website: data.website || undefined,
			description: data.description || undefined,
			country: data.country || undefined,
			establishedDate: data.establishedDate || undefined,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="publisherName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên nhà xuất bản *</FormLabel>
							<FormControl>
								<Input placeholder="Nhập tên nhà xuất bản" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Địa chỉ *</FormLabel>
							<FormControl>
								<Input placeholder="Nhập địa chỉ" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Số điện thoại *</FormLabel>
							<FormControl>
								<Input placeholder="Nhập số điện thoại" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email *</FormLabel>
							<FormControl>
								<Input type="email" placeholder="Nhập email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="website"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Website</FormLabel>
							<FormControl>
								<Input
									type="url"
									placeholder="https://example.com"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="country"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Quốc gia</FormLabel>
							<FormControl>
								<Input placeholder="Nhập quốc gia" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="establishedDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ngày thành lập</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
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
									placeholder="Nhập mô tả về nhà xuất bản"
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="isActive"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<FormLabel className="text-base">
									Trạng thái hoạt động
								</FormLabel>
								<div className="text-sm text-muted-foreground">
									Nhà xuất bản này có đang hoạt động không
								</div>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
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

export default EditPublisherForm;
