import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import type { Location, UpdateLocationData } from '@/types';

import { Button } from '@/components/ui/button';
import { IconLoader2 } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const updateLocationSchema = z.object({
	name: z.string().min(1, 'Tên vị trí không được để trống'),
	description: z.string().optional(),
	floor: z.string().optional(),
	section: z.string().optional(),
	shelf: z.string().optional(),
	isActive: z.boolean().default(true),
});

type UpdateLocationFormData = z.infer<typeof updateLocationSchema>;

interface EditLocationFormProps {
	location: Location;
	onSubmit: (data: UpdateLocationData) => void;
	isLoading?: boolean;
}

export const EditLocationForm = ({
	location,
	onSubmit,
	isLoading,
}: EditLocationFormProps) => {
	const form = useForm<UpdateLocationFormData>({
		resolver: zodResolver(updateLocationSchema),
		defaultValues: {
			name: location.name,
			description: location.description || '',
			floor: location.floor?.toString() || '',
			section: location.section || '',
			shelf: location.shelf || '',
			isActive: location.isActive,
		},
	});

	useEffect(() => {
		form.reset({
			name: location.name,
			description: location.description || '',
			floor: location.floor?.toString() || '',
			section: location.section || '',
			shelf: location.shelf || '',
			isActive: location.isActive,
		});
	}, [location, form]);

	const handleSubmit = (data: UpdateLocationFormData) => {
		const submitData: UpdateLocationData = {
			name: data.name,
			description: data.description || undefined,
			floor: data.floor ? parseInt(data.floor) : undefined,
			section: data.section || undefined,
			shelf: data.shelf || undefined,
			isActive: data.isActive,
		};
		onSubmit(submitData);
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
					Cập nhật vị trí
				</Button>
			</form>
		</Form>
	);
};
