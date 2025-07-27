import { Check, ChevronsUpDown } from 'lucide-react';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import type { Reader, UpdateReaderRequest } from '@/types/readers';
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
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useReaderTypesDropdown } from '@/hooks/readers/use-reader-types-dropdown';
import { useUsersDropdown } from '@/hooks/users/use-users-dropdown';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const updateReaderSchema = z.object({
	fullName: z
		.string()
		.min(1, 'Họ tên là bắt buộc')
		.max(255, 'Họ tên tối đa 255 ký tự'),
	dob: z.string().min(1, 'Ngày sinh là bắt buộc'),
	gender: z.enum(['male', 'female', 'other'], {
		error: 'Giới tính là bắt buộc',
	}),
	address: z.string().min(1, 'Địa chỉ là bắt buộc'),
	phone: z
		.string()
		.min(10, 'Số điện thoại tối thiểu 10 ký tự')
		.max(15, 'Số điện thoại tối đa 15 ký tự'),
	userId: z.string().min(1, 'User là bắt buộc'),
	readerTypeId: z.string().min(1, 'Loại độc giả là bắt buộc'),
	cardExpiryDate: z.string().min(1, 'Ngày hết hạn thẻ là bắt buộc'),
});

type UpdateReaderFormData = z.infer<typeof updateReaderSchema>;

interface EditReaderFormProps {
	reader: Reader;
	onSubmit: (data: UpdateReaderRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

const EditReaderForm = ({
	reader,
	onSubmit,
	onCancel,
	isLoading = false,
}: EditReaderFormProps) => {
	const { readerTypes, isLoading: isLoadingReaderTypes } =
		useReaderTypesDropdown();
	const { users, isLoading: isLoadingUsers } = useUsersDropdown();

	const form = useForm<UpdateReaderFormData>({
		resolver: zodResolver(updateReaderSchema),
		defaultValues: {
			fullName: reader.fullName,
			dob: reader.dob,
			gender: reader.gender,
			address: reader.address,
			phone: reader.phone,
			userId: reader.userId,
			readerTypeId: reader.readerTypeId,
			cardExpiryDate: reader.cardExpiryDate,
		},
	});

	const handleSubmit = (data: UpdateReaderFormData) => {
		onSubmit(data);
	};

	// Hàm xử lý khi chọn user
	const handleUserSelect = (userId: string) => {
		const selectedUser = users.find((user) => user.id === userId);
		if (selectedUser) {
			// Điền họ tên từ user được chọn
			form.setValue('fullName', selectedUser.username);

			// Tìm và set loại độc giả "student"
			const studentType = readerTypes.find(
				(type) => type.typeName === 'student'
			);
			if (studentType) {
				form.setValue('readerTypeId', studentType.id);
			}
		}
	};

	useEffect(() => {
		if (reader.userId) {
			handleUserSelect(reader.userId);
		}
	}, [reader.userId, users]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="fullName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Họ tên *</FormLabel>
							<FormControl>
								<Input placeholder="Nhập họ tên đầy đủ" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="dob"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ngày sinh *</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="gender"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Giới tính *</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Chọn giới tính" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="male">Nam</SelectItem>
									<SelectItem value="female">Nữ</SelectItem>
									<SelectItem value="other">Khác</SelectItem>
								</SelectContent>
							</Select>
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
								<Textarea
									placeholder="Nhập địa chỉ đầy đủ"
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
					name="userId"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>User *</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											className={cn(
												'w-full justify-between',
												!field.value && 'text-muted-foreground'
											)}
											disabled={isLoadingUsers}
										>
											{(() => {
												const selectedUser = users.find(
													(user) => user.id === field.value
												);
												return field.value
													? selectedUser
														? `${selectedUser.username} (${selectedUser.userCode})`
														: field.value
													: 'Chọn user';
											})()}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandInput placeholder="Tìm kiếm user..." />
										<CommandList>
											<CommandEmpty>Không tìm thấy user.</CommandEmpty>
											<CommandGroup>
												{users.map((user) => (
													<CommandItem
														value={`${user.username} ${user.email} ${user.userCode}`}
														key={user.id}
														onSelect={() => {
															form.setValue('userId', user.id);
															handleUserSelect(user.id);
														}}
													>
														<Check
															className={cn(
																'mr-2 h-4 w-4',
																user.id === field.value
																	? 'opacity-100'
																	: 'opacity-0'
															)}
														/>
														<div className="flex flex-col">
															<span className="font-medium">
																{user.username}
															</span>
															<span className="text-sm text-muted-foreground">
																{user.userCode} • {user.email}
															</span>
														</div>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="readerTypeId"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Loại độc giả *</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											className={cn(
												'w-full justify-between',
												!field.value && 'text-muted-foreground'
											)}
											disabled={isLoadingReaderTypes}
										>
											{field.value
												? readerTypes.find((type) => type.id === field.value)
														?.typeName || field.value
												: 'Chọn loại độc giả'}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandInput placeholder="Tìm kiếm loại độc giả..." />
										<CommandList>
											<CommandEmpty>Không tìm thấy loại độc giả.</CommandEmpty>
											<CommandGroup>
												{readerTypes.map((type) => (
													<CommandItem
														value={type.typeName}
														key={type.id}
														onSelect={() => {
															form.setValue('readerTypeId', type.id);
														}}
													>
														<Check
															className={cn(
																'mr-2 h-4 w-4',
																type.id === field.value
																	? 'opacity-100'
																	: 'opacity-0'
															)}
														/>
														<div className="flex flex-col">
															<span className="font-medium">
																{type.typeName}
															</span>
															{type.description && (
																<span className="text-sm text-muted-foreground">
																	{type.description}
																</span>
															)}
														</div>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="cardExpiryDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ngày hết hạn thẻ *</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
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

export default EditReaderForm;
