import { PrivateRoute, PublicRoute } from '@/components';
import { Outlet, createBrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@/context/auth-context';
import { AuthenticatedLayout } from './layout/authenticated-layout';
import Dashboard from './pages/dashboard/page';
import LoginPage from './pages/login/page';
import NotFound from './pages/not-found';
import UserPage from './pages/users/page';

// Root layout that provides AuthProvider context
const RootLayout = () => (
	<AuthProvider>
		<Outlet />
	</AuthProvider>
);

const routes = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				path: '/login',
				element: (
					<PublicRoute>
						<LoginPage />
					</PublicRoute>
				),
			},
			{
				path: '/',
				element: (
					<PrivateRoute>
						<AuthenticatedLayout />
					</PrivateRoute>
				),
				children: [
					{
						index: true,
						element: <Dashboard />,
					},
					{
						path: '/users',
						element: <UserPage />,
					},
				],
			},
			{
				path: '*',
				element: <NotFound />,
			},
		],
	},
]);

export default routes;
