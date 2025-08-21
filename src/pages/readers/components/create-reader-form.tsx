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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useReaderTypesDropdown } from '@/hooks/readers/use-reader-types-dropdown';
import { useUsersDropdown } from '@/hooks/users/use-users-dropdown';
import { cn } from '@/lib/utils';
import type { CreateReaderRequest } from '@/types/readers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const createReaderSchema = z.object({
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
	cardNumber: z.string().optional(),
	cardIssueDate: z.string().optional(),
	cardExpiryDate: z.string().min(1, 'Ngày hết hạn thẻ là bắt buộc'),
});

type CreateReaderFormData = z.infer<typeof createReaderSchema>;

interface CreateReaderFormProps {
	onSubmit: (data: CreateReaderRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

const CreateReaderForm = ({
	onSubmit,
	onCancel,
	isLoading = false,
}: CreateReaderFormProps) => {
	const { users, isLoading: isLoadingUsers } = useUsersDropdown();
	const { readerTypes, isLoading: isLoadingReaderTypes } =
		useReaderTypesDropdown();

	const [userPopoverOpen, setUserPopoverOpen] = useState(false);
	const [readerTypePopoverOpen, setReaderTypePopoverOpen] = useState(false);

	const form = useForm<CreateReaderFormData>({
		resolver: zodResolver(createReaderSchema),
		defaultValues: {
			fullName: '',
			dob: '',
			gender: 'male',
			address: '',
			phone: '',
			userId: '',
			readerTypeId: '',
			cardNumber: '',
			cardIssueDate: new Date().toISOString().split('T')[0],
			cardExpiryDate: '',
		},
	});

	const handleSubmit = (data: CreateReaderFormData) => {
		onSubmit({
			...data,
			cardNumber: data.cardNumber || undefined,
			cardIssueDate: data.cardIssueDate || undefined,
		});
	};

	// Hàm xử lý khi chọn user
	const handleUserSelect = (userId: string) => {
		const selectedUser = users.find((user) => user.id === userId);
		if (selectedUser) {
			// Điền họ tên từ user được chọn
			form.setValue('fullName', selectedUser.username);

			// Tạo số thẻ từ mã sinh viên
			const cardNumber = `${selectedUser.userCode}`;
			form.setValue('cardNumber', cardNumber);

			// Xử lý loại độc giả dựa trên role
			if (selectedUser.role === 'reader') {
				// Nếu role là reader, tìm và set loại độc giả "student"
				const studentType = readerTypes.find(
					(type) => type.typeName === 'student'
				);
				if (studentType) {
					form.setValue('readerTypeId', studentType.id);
				}
			} else if (selectedUser.role === 'admin') {
				// Nếu role là admin, cho phép người dùng chọn loại độc giả
				// Không set giá trị mặc định
			}

			// Tính ngày hết hạn thẻ (1 năm sau ngày cấp thẻ)
			const issueDate = new Date();
			const expiryDate = new Date(issueDate);
			expiryDate.setFullYear(expiryDate.getFullYear() + 1);

			form.setValue('cardIssueDate', issueDate.toISOString().split('T')[0]);
			form.setValue('cardExpiryDate', expiryDate.toISOString().split('T')[0]);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="userId"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Thông tin người dùng *</FormLabel>
							<Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
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
											{field.value
												? users.find((user) => user.id === field.value)
														?.username || field.value
												: 'Chọn người dùng'}
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
															setUserPopoverOpen(false);
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
					name="fullName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Họ tên *</FormLabel>
							<FormControl>
								<Input
									placeholder="Họ tên sẽ được điền tự động khi chọn người dùng"
									{...field}
									disabled={true}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="cardNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Số thẻ thư viện</FormLabel>
							<FormControl>
								<Input
									placeholder="Số thẻ sẽ được tạo tự động từ mã người dùng"
									{...field}
									disabled={true}
								/>
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
					name="readerTypeId"
					render={({ field }) => {
						const selectedUserId = form.watch('userId');
						const selectedUser = users.find(
							(user) => user.id === selectedUserId
						);
						const isDisabled =
							selectedUser?.role === 'reader' || isLoadingReaderTypes;

						return (
							<FormItem className="flex flex-col">
								<FormLabel>Loại độc giả *</FormLabel>
								<Popover
									open={readerTypePopoverOpen}
									onOpenChange={setReaderTypePopoverOpen}
								>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												role="combobox"
												className={cn(
													'w-full justify-between',
													!field.value && 'text-muted-foreground'
												)}
												disabled={isDisabled}
											>
												{field.value
													? readerTypes.find((type) => type.id === field.value)
															?.typeName || field.value
													: selectedUser?.role === 'reader'
													? 'Student (tự động)'
													: 'Chọn loại độc giả'}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-full p-0">
										<Command>
											<CommandInput placeholder="Tìm kiếm loại độc giả..." />
											<CommandList>
												<CommandEmpty>
													Không tìm thấy loại độc giả.
												</CommandEmpty>
												<CommandGroup>
													{readerTypes.map((type) => (
														<CommandItem
															value={type.typeName}
															key={type.id}
															onSelect={() => {
																form.setValue('readerTypeId', type.id);
																setReaderTypePopoverOpen(false);
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
						);
					}}
				/>

				<FormField
					control={form.control}
					name="cardIssueDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ngày cấp thẻ</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
							</FormControl>
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
						{isLoading ? 'Đang tạo...' : 'Tạo độc giả'}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default CreateReaderForm;
