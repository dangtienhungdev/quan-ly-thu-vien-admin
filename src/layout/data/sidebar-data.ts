import { IconLayoutDashboard } from '@tabler/icons-react';
import {
	BookOpen,
	BookOpenCheck,
	Building2,
	Calendar,
	Command,
	Library,
	PenTool,
	Receipt,
	User,
	Users,
	Users2,
} from 'lucide-react';
import { type SidebarData } from '../types';

export const sidebarData: SidebarData = {
	user: {
		name: 'Đặng Tiến Hưng',
		email: 'dangtienhung.dev@gmail.com',
		avatar: '/avatars/shadcn.jpg',
	},
	teams: [
		{
			name: 'Trường THPT Hoài Đức A',
			logo: Command,
			plan: 'Vite + ShadcnUI',
		},
	],
	navGroups: [
		{
			title: 'Tổng quan',
			items: [
				{
					title: 'Dashboard',
					url: '/',
					icon: IconLayoutDashboard,
				},
				{
					title: 'Quản lý người dùng',
					url: '/users',
					icon: User,
				},
			],
		},
		{
			title: 'Quản lý danh mục',
			items: [
				{
					title: 'Quản lý tác giả',
					icon: PenTool,
					url: '/authors',
				},
				{
					title: 'Quản lý nhà xuất bản',
					icon: Building2,
					url: '/publishers',
				},
				{
					title: 'Quản lý thể loại',
					icon: Library,
					url: '/book-categories',
				},
				{
					title: 'Cài đặt quyền mượn sách',
					icon: Users,
					url: '/reader-types',
				},
				{
					title: 'Quản lý độc giả',
					icon: Users2,
					url: '/readers',
				},
			],
		},
		{
			title: 'Quản lý sách',
			items: [
				{
					title: 'Thông tin sách',
					icon: BookOpen,
					url: '/books',
				},
			],
		},
		{
			title: 'Giao dịch thư viện',
			items: [
				{
					title: 'Mượn trả sách',
					icon: BookOpenCheck,
					url: '/borrow-records',
				},
				{
					title: 'Đặt trước sách',
					icon: Calendar,
					url: '/reservations',
				},
				{
					title: 'Quản lý phạt',
					icon: Receipt,
					url: '/fines',
				},
			],
		},
	],
};
