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
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md flex flex-col gap-6 border border-blue-100"
				>
					<h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
						Login
					</h2>
					<FormField
						control={form.control}
						name="username"
						render={({ field, fieldState }) => (
							<div>
								<label
									htmlFor="login-username"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Username
								</label>
								<Input
									id="login-username"
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
									Password
								</label>
								<Input
									id="login-password"
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
	);
}
