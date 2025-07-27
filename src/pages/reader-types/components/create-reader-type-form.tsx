import type {
	CreateReaderTypeRequest,
	ReaderTypeName,
} from '@/types/reader-types';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createReaderTypeSchema = z.object({
	typeName: z.enum(['student', 'teacher', 'staff'] as const),
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

type CreateReaderTypeFormData = z.infer<typeof createReaderTypeSchema>;

interface CreateReaderTypeFormProps {
	onSubmit: (data: CreateReaderTypeRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

const CreateReaderTypeForm = ({
	onSubmit,
	onCancel,
	isLoading = false,
}: CreateReaderTypeFormProps) => {
	const form = useForm<CreateReaderTypeFormData>({
		resolver: zodResolver(createReaderTypeSchema),
		defaultValues: {
			typeName: 'student',
			maxBorrowLimit: 5,
			borrowDurationDays: 14,
			description: '',
			lateReturnFinePerDay: 5000,
		},
	});

	const handleSubmit = (data: CreateReaderTypeFormData) => {
		onSubmit(data);
	};

	const getTypeNameLabel = (typeName: ReaderTypeName) => {
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
				<FormField
					control={form.control}
					name="typeName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Loại độc giả</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Chọn loại độc giả" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="student">Sinh viên</SelectItem>
									<SelectItem value="teacher">Giảng viên</SelectItem>
									<SelectItem value="staff">Nhân viên</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

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

				<FormField
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
				/>

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
						{isLoading ? 'Đang tạo...' : 'Tạo loại độc giả'}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default CreateReaderTypeForm;
