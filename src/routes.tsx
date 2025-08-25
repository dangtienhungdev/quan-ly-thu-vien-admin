import { PrivateRoute, PublicRoute } from '@/components';
import { Outlet, createBrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@/context/auth-context';
import { AuthenticatedLayout } from './layout/authenticated-layout';
import AuthorsPage from './pages/authors/page';
import BookCategoriesPage from './pages/book-categories/page';
import EBookDetailPage from './pages/books/ebook/[id]/page';
import BooksPage from './pages/books/page';
import PhysicalBookDetailPage from './pages/books/physical/[id]/page';
import BorrowRecordsPage from './pages/borrow-records/page';
import CategoriesPage from './pages/categories/page';
import Dashboard from './pages/dashboard/page';
import EBooksPage from './pages/ebooks/page';
import FinesPage from './pages/fines';
import LoginPage from './pages/login/page';
import NotFound from './pages/not-found';
import PhysicalBooksPage from './pages/physical-books/page';
import PhysicalCopiesPage from './pages/physical-copies/page';
import PublishersPage from './pages/publishers/page';
import ReaderTypes from './pages/reader-types/page';
import ReadersPage from './pages/readers/page';
import RenewalsPage from './pages/renewals/page';
import ReservationsPage from './pages/reservations/page';
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
					// {
					// 	path: '/grade-levels',
					// 	element: <GradeLevelsPage />,
					// },
					{
						path: '/book-categories',
						element: <BookCategoriesPage />,
					},
					{
						path: '/publishers',
						element: <PublishersPage />,
					},
					{
						path: '/authors',
						element: <AuthorsPage />,
					},
					{
						path: '/physical-books',
						element: <PhysicalBooksPage />,
					},
					{
						path: '/physical-copies',
						element: <PhysicalCopiesPage />,
					},
					{
						path: '/ebooks',
						element: <EBooksPage />,
					},
					{
						path: '/borrow-records',
						element: <BorrowRecordsPage />,
					},
					{
						path: '/reservations',
						element: <ReservationsPage />,
					},
					{
						path: '/renewals',
						element: <RenewalsPage />,
					},
					{
						path: '/fines',
						element: <FinesPage />,
					},
					{
						path: '/readers',
						element: <ReadersPage />,
					},
					{
						path: '/books',
						element: <BooksPage />,
					},
					{
						path: '/books/ebook/:id',
						element: <EBookDetailPage />,
					},
					{
						path: '/books/physical/:id',
						element: <PhysicalBookDetailPage />,
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
