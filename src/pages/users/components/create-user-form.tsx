import * as React from 'react';

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
import type { CreateUserRequest, UserRole } from '@/types/user.type';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const createUserSchema = z.object({
	userCode: z.string().min(1, 'Mã người dùng là bắt buộc'),
	username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
	password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
	email: z.string().email('Email không hợp lệ'),
	role: z.enum(['admin', 'reader'] as const),
	accountStatus: z.enum(['active', 'inactive', 'banned'] as const),
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
	const form = useForm<CreateUserFormData>({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			userCode: '',
			username: '',
			password: '',
			email: '',
			role: defaultRole,
			accountStatus: 'active',
		},
	});

	// Tự động tạo userCode khi role thay đổi
	const watchRole = form.watch('role');
	const generateUserCode = () => {
		const timestamp = Date.now().toString().slice(-6);
		if (watchRole === 'admin') {
			return `NV${timestamp}`;
		} else {
			return `SV${timestamp}`;
		}
	};

	// Cập nhật userCode khi role thay đổi
	React.useEffect(() => {
		const currentUserCode = form.getValues('userCode');
		if (
			!currentUserCode ||
			currentUserCode.startsWith('NV') ||
			currentUserCode.startsWith('SV')
		) {
			form.setValue('userCode', generateUserCode());
		}
	}, [watchRole, form]);

	const handleSubmit = (data: CreateUserFormData) => {
		onSubmit(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
								<Input type="password" placeholder="Nhập mật khẩu" {...field} />
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
								<Input type="email" placeholder="Nhập email" {...field} />
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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Chọn trạng thái" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="active">Hoạt động</SelectItem>
									<SelectItem value="inactive">Không hoạt động</SelectItem>
									<SelectItem value="banned">Bị cấm</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end space-x-2 pt-4">
					<Button type="button" variant="outline" onClick={onCancel}>
						Hủy
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Đang tạo...' : 'Tạo người dùng'}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default CreateUserForm;
