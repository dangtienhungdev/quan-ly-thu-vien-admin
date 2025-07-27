import { Outlet, createBrowserRouter } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from '@/components';

import { AuthProvider } from '@/context/auth-context';
import { AuthenticatedLayout } from './layout/authenticated-layout';
import AuthorsPage from './pages/authors/page';
import CategoriesPage from './pages/categories/page';
import Dashboard from './pages/dashboard/page';
import LoginPage from './pages/login/page';
import NotFound from './pages/not-found';
import PublishersPage from './pages/publishers/page';
import ReaderTypes from './pages/reader-types/page';
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
					{
						path: '/reader-types',
						element: <ReaderTypes />,
					},
					{
						path: '/categories',
						element: <CategoriesPage />,
					},
					{
						path: '/publishers',
						element: <PublishersPage />,
					},
					{
						path: '/authors',
						element: <AuthorsPage />,
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
