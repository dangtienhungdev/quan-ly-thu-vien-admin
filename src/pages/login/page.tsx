import { Form, FormField } from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const form = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: { username: '', password: '' },
	});

	const { login, isLoading } = useAuth();
	const [error, setError] = React.useState('');

	const handleSubmit = async (data: LoginForm) => {
		setError('');
		try {
			await login(data);
		} catch (err: any) {
			setError(err?.message || 'Login failed. Please try again.');
		}
	};

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative"
			style={{
				backgroundImage: `url('/background.jpg')`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<div className="absolute inset-0 bg-black opacity-60"></div>
			<div className="w-full max-w-md z-10">
				<div className="bg-white rounded-lg shadow-xl p-8">
					<div className="text-center mb-8">
						<div className="flex justify-center mb-4">
							<img
								// src="https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/537695210_1304240211495265_2418224581590370134_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=s2YVIhCZtSEQ7kNvwF2V05z&_nc_oc=AdmTeXWyuOiTxuQTzxwXlQcU-M6sIcHWgkbvWEmUgit6uGB4sNQZXZaFfVPMOOZdW04&_nc_zt=23&_nc_ht=scontent.fhan14-2.fna&_nc_gid=o8UOvFxQybsrwwYbR7UjjA&oh=00_AfVLGvH1B12OlfzIL21mqS4sbh6CIUYlFZY00E5Mrt5Cjw&oe=68AF11CD"
								src="/logo.jpg"
								alt="Logo trường THPT Hoài Đức A"
								width={80}
								height={80}
								className="rounded-full object-cover"
							/>
						</div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
						<p className="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
					</div>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="bg-white w-full flex flex-col gap-6"
						>
							<FormField
								control={form.control}
								name="username"
								render={({ field, fieldState }) => (
									<div>
										<label
											htmlFor="login-username"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Tài khoản đăng nhập
										</label>
										<Input
											id="login-username"
											placeholder="Tài khoản đăng nhập"
											type="text"
											className="w-full h-12 rounded-sm px-4 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
											autoFocus
											{...field}
										/>
										{fieldState.error && (
											<div className="text-red-500 text-xs mt-1">
												{fieldState.error.message}
											</div>
										)}
									</div>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field, fieldState }) => (
									<div>
										<label
											htmlFor="login-password"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Mật khẩu
										</label>
										<Input
											id="login-password"
											placeholder="Mật khẩu"
											type="password"
											className="w-full h-12 rounded-sm px-4 border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
											{...field}
										/>
										{fieldState.error && (
											<div className="text-red-500 text-xs mt-1">
												{fieldState.error.message}
											</div>
										)}
									</div>
								)}
							/>
							{error && (
								<div className="text-red-500 text-sm text-center">{error}</div>
							)}
							<Button
								type="submit"
								className="h-12 rounded-sm"
								disabled={isLoading}
							>
								{isLoading ? 'Logging in...' : 'Login'}
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
