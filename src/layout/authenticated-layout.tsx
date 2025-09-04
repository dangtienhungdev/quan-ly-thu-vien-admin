import { ProfileDropdown } from '@/components/profile-dropdown';
import SkipToMain from '@/components/skip-to-main';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SearchProvider } from '@/context/search-context';
import { AppSidebar } from '@/layout/app-sidebar';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Main } from './main';
import { TopNav } from './top-nav';

interface Props {
	children?: React.ReactNode;
}

export function AuthenticatedLayout({ children }: Props) {
	const defaultOpen = Cookies.get('sidebar_state') !== 'false';

	const topNav = [
		{
			title: 'Overview',
			href: '/',
			isActive: true,
			disabled: false,
		},
		{
			title: 'Người dùng',
			href: '/users',
			isActive: false,
			disabled: true,
		},
		{
			title: 'Quản lý sách',
			href: '/books',
			isActive: false,
			disabled: true,
		},
	];

	return (
		<SearchProvider>
			<SidebarProvider defaultOpen={defaultOpen}>
				<SkipToMain />
				<AppSidebar />
				<div
					id="content"
					className={cn(
						'ml-auto w-full max-w-full',
						'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
						'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
						'sm:transition-[width] sm:duration-200 sm:ease-linear',
						'flex h-svh flex-col',
						'group-data-[scroll-locked=1]/body:h-full',
						'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
					)}
				>
					{/* {children ? children : <Outlet />} */}
					<Header>
						<TopNav links={topNav} />
						<div className="ml-auto flex items-center space-x-4">
							{/* <Search /> */}
							<ProfileDropdown />
						</div>
					</Header>

					<Main>{children ? children : <Outlet />}</Main>
				</div>
			</SidebarProvider>
		</SearchProvider>
	);
}
