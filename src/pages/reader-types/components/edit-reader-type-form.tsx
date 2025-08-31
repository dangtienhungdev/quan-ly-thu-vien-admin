import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import type {
	ReaderTypeConfig,
	UpdateReaderTypeRequest,
} from '@/types/reader-types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const updateReaderTypeSchema = z.object({
	maxBorrowLimit: z
		.number()
		.min(1, 'Giới hạn mượn tối thiểu là 1')
		.max(20, 'Giới hạn mượn tối đa là 20'),
	borrowDurationDays: z
		.number()
		.min(1, 'Thời gian mượn tối thiểu là 1 ngày')
		.max(60, 'Thời gian mượn tối đa là 60 ngày'),
	description: z.string().min(1, 'Mô tả là bắt buộc'),
	lateReturnFinePerDay: z
		.number()
		.min(1000, 'Tiền phạt tối thiểu là 1,000 VND')
		.max(50000, 'Tiền phạt tối đa là 50,000 VND'),
});

type UpdateReaderTypeFormData = z.infer<typeof updateReaderTypeSchema>;

interface EditReaderTypeFormProps {
	readerType: ReaderTypeConfig;
	onSubmit: (data: UpdateReaderTypeRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

const EditReaderTypeForm = ({
	readerType,
	onSubmit,
	onCancel,
	isLoading = false,
}: EditReaderTypeFormProps) => {
	const form = useForm<UpdateReaderTypeFormData>({
		resolver: zodResolver(updateReaderTypeSchema),
		defaultValues: {
			maxBorrowLimit: readerType.maxBorrowLimit,
			borrowDurationDays: readerType.borrowDurationDays,
			description: readerType.description,
			lateReturnFinePerDay: readerType.lateReturnFinePerDay,
		},
	});

	const handleSubmit = (data: UpdateReaderTypeFormData) => {
		onSubmit(data);
	};

	const getTypeNameLabel = (typeName: string) => {
		switch (typeName) {
			case 'student':
				return 'Sinh viên';
			case 'teacher':
				return 'Giảng viên';
			case 'staff':
				return 'Nhân viên';
			default:
				return typeName;
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<div className="space-y-2">
					<label className="text-sm font-medium">Loại độc giả</label>
					<div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
						{getTypeNameLabel(readerType.typeName)}
					</div>
				</div>

				<FormField
					control={form.control}
					name="maxBorrowLimit"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Giới hạn mượn tối đa (cuốn)</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Nhập giới hạn mượn"
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
					name="borrowDurationDays"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thời gian mượn (ngày)</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Nhập thời gian mượn"
									{...field}
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* <FormField
					control={form.control}
					name="lateReturnFinePerDay"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tiền phạt trả muộn mỗi ngày (VND)</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Nhập tiền phạt"
									{...field}
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mô tả</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Nhập mô tả về loại độc giả"
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

export default EditReaderTypeForm;
