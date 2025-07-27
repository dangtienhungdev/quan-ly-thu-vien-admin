import { IconLayoutDashboard, IconLockAccess } from '@tabler/icons-react';
import { AudioWaveform, Command, GalleryVerticalEnd, User } from 'lucide-react';
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
			title: 'Người đùng hệ thống',
			items: [
				{
					title: 'Người dùng',
					icon: IconLockAccess,
					items: [
						{
							title: 'Nhân viên',
							url: '/staffs',
						},
						{
							title: 'Khách hàng',
							url: '/customers',
						},
					],
				},
			],
		},
	],
};
