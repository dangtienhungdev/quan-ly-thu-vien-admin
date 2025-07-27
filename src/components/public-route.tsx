import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/auth-context';
import React from 'react';

interface PublicRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
	children,
	redirectTo = '/',
}) => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	// Show loading spinner while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
			</div>
		);
	}

	// Redirect to dashboard if already authenticated
	if (isAuthenticated) {
		// Redirect to the intended destination or default to dashboard
		const from = location.state?.from?.pathname || redirectTo;
		return <Navigate to={from} replace />;
	}

	// Render children if not authenticated
	return <>{children}</>;
};
