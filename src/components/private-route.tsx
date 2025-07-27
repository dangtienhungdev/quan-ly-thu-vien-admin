import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/auth-context';
import React from 'react';

interface PrivateRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
	children,
	redirectTo = '/login',
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

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		return <Navigate to={redirectTo} state={{ from: location }} replace />;
	}

	// Render children if authenticated
	return <>{children}</>;
};
