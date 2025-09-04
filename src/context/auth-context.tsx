import type { LoginRequest, User } from '@/types/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { UsersAPI } from '@/apis/users';
import { useLogin } from '@/hooks';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (credentials: LoginRequest) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const queryClient = useQueryClient();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const isAuthenticated = !!localStorage.getItem('accessToken');

	const { data: currentUser } = useQuery({
		queryKey: ['currentUser'],
		queryFn: () => UsersAPI.getProfile(),
		enabled: !!isAuthenticated,
	});

	// Use the existing login hook
	const loginMutation = useLogin({
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
		},
		onError: (error) => {
			console.error('Login failed:', error);
		},
	});

	useEffect(() => {
		if (currentUser) {
			setUser(currentUser);
		}
	}, [currentUser]);

	const login = async (credentials: LoginRequest): Promise<void> => {
		try {
			setIsLoading(true);
			// Use the login mutation from the hook
			await loginMutation.loginAsync(credentials);
		} catch (error) {
			console.error('Login failed:', error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		// Clear user state
		setUser(null);

		// Clear all data from localStorage
		localStorage.clear();

		// Navigate to login page
		navigate('/login');
	};

	const value: AuthContextType = {
		user,
		isAuthenticated,
		isLoading: isLoading || loginMutation.isLoading,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
