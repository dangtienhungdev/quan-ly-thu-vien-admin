import { IconLayoutDashboard } from '@tabler/icons-react';
import {
	AudioWaveform,
	BookOpen,
	BookOpenCheck,
	Building2,
	Command,
	GalleryVerticalEnd,
	Library,
	PenTool,
	Receipt,
	RefreshCw,
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
			name: 'Shadcn Admin',
			logo: Command,
			plan: 'Vite + ShadcnUI',
		},
		{
			name: 'Acme Inc',
			logo: GalleryVerticalEnd,
			plan: 'Enterprise',
		},
		{
			name: 'Acme Corp.',
			logo: AudioWaveform,
			plan: 'Startup',
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
					title: 'Người dùng',
					url: '/users',
					icon: User,
				},
			],
		},
		{
			title: 'Hệ thống thư viện',
			items: [
				{
					title: 'Quản lý loại độc giả',
					icon: Users,
					url: '/reader-types',
				},
				{
					title: 'Quản lý độc giả',
					icon: Users2,
					url: '/readers',
				},
				{
					title: 'Quản lý danh mục',
					icon: Library,
					url: '/categories',
				},
				{
					title: 'Quản lý nhà xuất bản',
					icon: Building2,
					url: '/publishers',
				},
				{
					title: 'Quản lý tác giả',
					icon: PenTool,
					url: '/authors',
				},
			],
		},
		{
			title: 'Các loại sách',
			items: [
				{
					title: 'Quản lý loại sách',
					icon: BookOpen,
					items: [
						{
							title: 'Sách vật lý',
							url: '/physical-books',
						},
						{
							title: 'Sách điện tử',
							url: '/e-books',
						},
					],
				},
			],
		},
		{
			title: 'Mượn trả',
			items: [
				{
					title: 'Quản lý mượn sách',
					icon: BookOpenCheck,
					url: '/borrow-returns',
				},
				{
					title: 'Quản lý gia hạn',
					icon: RefreshCw,
					url: '/renewals',
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
