import type { CopyCondition, CreatePhysicalCopyRequest } from '@/types';
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
import { IconLoader2 } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useActiveLocations } from '@/hooks/locations';
import { useBooks } from '@/hooks/books';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createPhysicalCopySchema = z.object({
	book_id: z.string().min(1, 'Vui lòng chọn sách'),
	barcode: z.string().min(1, 'Barcode không được để trống'),
	purchase_date: z.string().min(1, 'Ngày mua không được để trống'),
	purchase_price: z.string().min(1, 'Giá mua không được để trống'),
	location_id: z.string().min(1, 'Vui lòng chọn vị trí'),
	current_condition: z.string().optional(),
	condition_details: z.string().optional(),
	notes: z.string().optional(),
});

type CreatePhysicalCopyFormData = z.infer<typeof createPhysicalCopySchema>;

interface CreatePhysicalCopyFormProps {
	onSubmit: (data: CreatePhysicalCopyRequest) => void;
	isLoading?: boolean;
}

export const CreatePhysicalCopyForm = ({
	onSubmit,
	isLoading,
}: CreatePhysicalCopyFormProps) => {
	const { data: locations } = useActiveLocations();
	const { data: booksData } = useBooks({ page: 1, limit: 100 });

	const form = useForm<CreatePhysicalCopyFormData>({
		resolver: zodResolver(createPhysicalCopySchema),
		defaultValues: {
			book_id: '',
			barcode: '',
			purchase_date: '',
			purchase_price: '',
			location_id: '',
			current_condition: 'new',
			condition_details: '',
			notes: '',
		},
	});

	const handleSubmit = (data: CreatePhysicalCopyFormData) => {
		const submitData: CreatePhysicalCopyRequest = {
			book_id: data.book_id,
			barcode: data.barcode,
			purchase_date: data.purchase_date,
			purchase_price: parseFloat(data.purchase_price),
			location_id: data.location_id,
			current_condition: data.current_condition as CopyCondition,
			condition_details: data.condition_details || undefined,
			notes: data.notes || undefined,
		};
		onSubmit(submitData);
		form.reset();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="book_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Sách *</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Chọn sách" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{booksData?.data.map((book) => (
										<SelectItem key={book.id} value={book.id}>
											{book.title}
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
					name="barcode"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Barcode *</FormLabel>
							<FormControl>
								<Input placeholder="Nhập barcode" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="purchase_date"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ngày mua *</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="purchase_price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Giá mua (VND) *</FormLabel>
							<FormControl>
								<Input type="number" placeholder="Nhập giá mua" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="location_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Vị trí *</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Chọn vị trí" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{locations?.map((location) => (
										<SelectItem key={location.id} value={location.id}>
											{location.name}
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
					name="current_condition"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tình trạng</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Chọn tình trạng" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="new">Mới</SelectItem>
									<SelectItem value="good">Tốt</SelectItem>
									<SelectItem value="worn">Cũ</SelectItem>
									<SelectItem value="damaged">Hư hỏng</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="condition_details"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Chi tiết tình trạng</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Mô tả chi tiết tình trạng..."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ghi chú</FormLabel>
							<FormControl>
								<Textarea placeholder="Ghi chú thêm..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex gap-2 pt-4">
					<Button type="submit" disabled={isLoading} className="flex-1">
						{isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
						Tạo bản sao
					</Button>
				</div>
			</form>
		</Form>
	);
};
