import type {
	AuthResponse,
	ChangePasswordRequest,
	ForgotPasswordRequest,
	LoginRequest,
	ResetPasswordRequest,
	User,
} from './common';

export type {
	AuthResponse,
	ChangePasswordRequest,
	ForgotPasswordRequest,
	LoginRequest,
	ResetPasswordRequest,
	User,
};

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export interface LoginFormData {
	username: string;
	password: string;
	rememberMe?: boolean;
}

export interface ChangePasswordFormData {
	currentPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}

export interface ForgotPasswordFormData {
	email: string;
}

export interface ResetPasswordFormData {
	token: string;
	newPassword: string;
	confirmNewPassword: string;
}
