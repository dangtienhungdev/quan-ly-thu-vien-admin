import { AuthAPI } from '@/apis/auth';
import type { LoginRequest } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UseLoginOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export const useLogin = (options: UseLoginOptions = {}) => {
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: (data: LoginRequest) => AuthAPI.login(data),
		onSuccess: (data) => {
			console.log('🚀 ~ useLogin ~ data:', data);
			// Save authentication data to localStorage
			AuthAPI.saveAuthData(data);

			// Show success notification
			toast.success('Login successful!');

			// Call custom onSuccess callback if provided
			options.onSuccess?.();

			// Navigate to dashboard
			navigate('/');
		},
		onError: (error: Error) => {
			// Show error notification
			toast.error(error.message || 'Login failed. Please try again.');

			// Call custom onError callback if provided
			options.onError?.(error);
		},
	});

	return {
		login: mutation.mutate,
		loginAsync: mutation.mutateAsync,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};
