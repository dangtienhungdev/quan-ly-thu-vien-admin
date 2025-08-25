import { IconLayoutDashboard } from '@tabler/icons-react';
import {
	AudioWaveform,
	BookOpen,
	BookOpenCheck,
	Building2,
	Calendar,
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
					title: 'Cài đặt quyền mượn sách',
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
				// {
				// 	title: 'Quản lý Khối lớp',
				// 	icon: Library,
				// 	url: '/grade-levels',
				// },
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
				{
					title: 'Thể loại chi tiết',
					icon: Library,
					url: '/book-categories',
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
				// {
				// 	title: 'Bản sao vật lý',
				// 	icon: Copy,
				// 	url: '/physical-copies',
				// },
				// {
				// 	title: 'Sách điện tử',
				// 	icon: FileText,
				// 	url: '/ebooks',
				// },
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
