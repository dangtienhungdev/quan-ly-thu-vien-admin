import * as React from 'react';

import type { CreateUserRequest, UserRole } from '@/types/user.type';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { UsersAPI } from '@/apis/users';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createUserSchema = z.object({
	userCode: z.string().min(1, 'Mã người dùng là bắt buộc'),
	username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
	password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
	email: z.string().email('Email không hợp lệ'),
	role: z.enum(['admin', 'reader'] as const),
	accountStatus: z.enum(['active', 'inactive', 'banned'] as const),
	// Reader fields
	fullName: z.string().min(1, 'Họ tên là bắt buộc'),
	dob: z.string().min(1, 'Ngày sinh là bắt buộc'),
	gender: z.enum(['male', 'female', 'other'] as const),
	address: z.string().min(1, 'Địa chỉ là bắt buộc'),
	phone: z.string().min(1, 'Số điện thoại là bắt buộc'),
	readerType: z.enum(['student', 'teacher', 'staff'] as const),
	cardNumber: z.string().min(1, 'Số thẻ là bắt buộc'),
	cardIssueDate: z.string().min(1, 'Ngày cấp thẻ là bắt buộc'),
	cardExpiryDate: z.string().min(1, 'Ngày hết hạn thẻ là bắt buộc'),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserFormProps {
	onSubmit: (data: CreateUserRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
	defaultRole?: UserRole;
}

const CreateUserForm = ({
	onSubmit,
	onCancel,
	isLoading = false,
	defaultRole = 'reader',
}: CreateUserFormProps) => {
	const queryClient = useQueryClient();

	const form = useForm<CreateUserFormData>({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			userCode: '',
			username: '',
			password: '',
			email: '',
			role: defaultRole,
			accountStatus: 'active',
			fullName: '',
			dob: '',
			gender: 'male',
			address: '',
			phone: '',
			readerType: 'student',
			cardNumber: '',
			cardIssueDate: new Date().toISOString().split('T')[0], // Today
			cardExpiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split('T')[0], // 3 years from now
		},
	});

	// Tự động tạo userCode và cardNumber khi role thay đổi
	const watchRole = form.watch('role');
	const watchUsername = form.watch('username');

	const generateUserCode = () => {
		const timestamp = Date.now().toString().slice(-6);
		if (watchRole === 'admin') {
			return `NV${timestamp}`;
		} else {
			return `SV${timestamp}`;
		}
	};

	// Cập nhật userCode và cardNumber khi role thay đổi
	React.useEffect(() => {
		const currentUserCode = form.getValues('userCode');
		const currentCardNumber = form.getValues('cardNumber');

		if (
			!currentUserCode ||
			currentUserCode.startsWith('NV') ||
			currentUserCode.startsWith('SV')
		) {
			const newUserCode = generateUserCode();
			form.setValue('userCode', newUserCode);
			// Cập nhật cardNumber = userCode
			form.setValue('cardNumber', newUserCode);
		}
	}, [watchRole, form]);

	// Cập nhật fullName khi username thay đổi
	React.useEffect(() => {
		if (watchUsername) {
			form.setValue('fullName', watchUsername);
		}
	}, [watchUsername, form]);

	// Cập nhật ngày hết hạn khi ngày cấp thay đổi
	const watchCardIssueDate = form.watch('cardIssueDate');
	React.useEffect(() => {
		if (watchCardIssueDate) {
			const issueDate = new Date(watchCardIssueDate);
			const expiryDate = new Date(issueDate);
			expiryDate.setFullYear(expiryDate.getFullYear() + 3); // 3 years later
			form.setValue('cardExpiryDate', expiryDate.toISOString().split('T')[0]);
		}
	}, [watchCardIssueDate, form]);

	const handleSubmit = async (data: CreateUserFormData) => {
		console.log('🚀 ~ handleSubmit ~ data:', data);
		try {
			// Tạo user trước
			const userData: CreateUserRequest = {
				userCode: data.userCode,
				username: data.username,
				password: data.password,
				email: data.email,
				role: data.role,
				accountStatus: data.accountStatus,
			};

			// Gọi API tạo user
			const newUser = await UsersAPI.create(userData);
			console.log('🚀 ~ handleSubmit ~ newUser:', newUser);

			// Nếu tạo user thành công và role là reader, tạo reader
			if (newUser) {
				try {
					// Tạo reader data
					const readerData = {
						userId: newUser.id,
						fullName: data.fullName,
						dob: data.dob ? new Date(data.dob + 'T00:00:00') : null,
						gender: data.gender,
						address: data.address,
						phone: data.phone,
						cardNumber: data.cardNumber,
						cardIssueDate: data.cardIssueDate
							? new Date(data.cardIssueDate + 'T00:00:00')
							: null,
						cardExpiryDate: data.cardExpiryDate
							? new Date(data.cardExpiryDate + 'T00:00:00')
							: null,
						readerTypeName: data.readerType,
					};

					// Gọi API tạo reader
					await UsersAPI.createReaderForUser(newUser.id, readerData);

					toast.success('Tạo user và reader thành công!');
					queryClient.invalidateQueries({ queryKey: ['users'] });
				} catch (readerError: any) {
					console.error('Error creating reader:', readerError);
					toast.error(
						`Tạo user thành công nhưng tạo reader thất bại: ${readerError.message}`
					);
				}
			} else {
				toast.success('Tạo user thành công!');
			}
		} catch (error: any) {
			console.error('Error creating user:', error);
			toast.error(`Tạo user thất bại: ${error.message}`);
		}
	};

	return (
		<div className="h-full flex flex-col max-h-screen">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="flex-1 flex flex-col min-h-0"
				>
					{/* Scrollable content area */}
					<ScrollArea className="flex-1 px-1 max-h-[calc(100vh-120px)]">
						<div className="space-y-4 pb-4">
							{/* User Information Section */}
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="userCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Mã người dùng</FormLabel>
											<FormControl>
												<Input
													placeholder="Mã sẽ được tạo tự động"
													{...field}
													className="font-mono"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tên đăng nhập</FormLabel>
											<FormControl>
												<Input placeholder="Nhập tên đăng nhập" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Mật khẩu</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Nhập mật khẩu"
													{...field}
												/>
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
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="Nhập email"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Vai trò</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Chọn vai trò" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="reader">Người dùng</SelectItem>
													<SelectItem value="admin">Nhân viên</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="accountStatus"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Trạng thái tài khoản</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Chọn trạng thái" />
													</SelectTrigger>
												</FormControl>
												<SelectContent className="w-full">
													<SelectItem value="active">Hoạt động</SelectItem>
													<SelectItem value="inactive">
														Không hoạt động
													</SelectItem>
													<SelectItem value="banned">Bị cấm</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Reader Information Section - Only show if role is reader */}
							<div className="space-y-4 ">
								<FormField
									control={form.control}
									name="dob"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Ngày sinh</FormLabel>
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
											<FormLabel>Giới tính</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
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
											<FormLabel>Địa chỉ</FormLabel>
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
											<FormLabel>Số điện thoại</FormLabel>
											<FormControl>
												<Input placeholder="Nhập số điện thoại" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="readerType"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Loại độc giả</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Chọn loại độc giả" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="student">Sinh viên</SelectItem>
													<SelectItem value="teacher">Giáo viên</SelectItem>
													<SelectItem value="staff">Nhân viên</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
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

								{/* Hidden fields for form validation */}
								<input type="hidden" {...form.register('fullName')} />
								<input type="hidden" {...form.register('cardNumber')} />
								<input type="hidden" {...form.register('cardExpiryDate')} />
							</div>
						</div>
					</ScrollArea>

					{/* Fixed bottom buttons */}
					<div className="flex-shrink-0 bg-background border-t py-4 px-4">
						<div className="flex justify-end space-x-2">
							<Button type="button" variant="outline" onClick={onCancel}>
								Hủy
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? 'Đang tạo...' : 'Tạo người dùng'}
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default CreateUserForm;
