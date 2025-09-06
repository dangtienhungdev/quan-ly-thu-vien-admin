import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import type { CreateLocationData } from '@/types';
import { IconLoader2 } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createLocationSchema = z.object({
	name: z.string().min(1, 'Tên vị trí không được để trống'),
	description: z.string().optional(),
	floor: z.string().optional(),
	section: z.string().optional(),
	shelf: z.string().optional(),
	isActive: z.boolean(),
});

type CreateLocationFormData = z.infer<typeof createLocationSchema>;

interface CreateLocationFormProps {
	onSubmit: (data: CreateLocationData) => void;
	isLoading?: boolean;
}

export const CreateLocationForm = ({
	onSubmit,
	isLoading,
}: CreateLocationFormProps) => {
	const form = useForm<CreateLocationFormData>({
		resolver: zodResolver(createLocationSchema),
		defaultValues: {
			name: '',
			description: '',
			floor: '',
			section: '',
			shelf: '',
			isActive: true,
		},
	});

	const handleSubmit = (data: CreateLocationFormData) => {
		const submitData: CreateLocationData = {
			name: data.name,
			description: data.description || undefined,
			floor: data.floor ? parseInt(data.floor) : undefined,
			section: data.section || undefined,
			shelf: data.shelf || undefined,
			isActive: data.isActive,
		};
		onSubmit(submitData);
		form.reset();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên vị trí *</FormLabel>
							<FormControl>
								<Input
									placeholder="VD: Kệ A1 - Tầng 1"
									{...field}
									disabled={isLoading}
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
									placeholder="Mô tả chi tiết về vị trí..."
									{...field}
									disabled={isLoading}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="floor"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tầng</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="VD: 1"
										{...field}
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="section"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Khu vực</FormLabel>
								<FormControl>
									<Input
										placeholder="VD: Khu A"
										{...field}
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="shelf"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Số kệ</FormLabel>
							<FormControl>
								<Input placeholder="VD: A1" {...field} disabled={isLoading} />
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
									Vị trí có thể được sử dụng để gán cho bản sao sách
								</div>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={isLoading}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
					Tạo vị trí
				</Button>
			</form>
		</Form>
	);
};
