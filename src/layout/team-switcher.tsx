import * as React from 'react';

import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth-context';
import { Link } from 'react-router-dom';

export function TeamSwitcher({
	teams,
}: {
	teams: {
		name: string;
		logo: React.ElementType;
		plan: string;
	}[];
}) {
	const { isMobile } = useSidebar();
	const [activeTeam, setActiveTeam] = React.useState(teams[0]);

	const { user } = useAuth();
	console.log('🚀 ~ TeamSwitcher ~ user:', user);

	return (
		<Link to="/">
			<button className="data-[state=open]:bg-sidebar-accent w-full flex items-center justify-between gap-2 data-[state=open]:text-sidebar-accent-foreground">
				<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
					<img
						src="/logo.jpg"
						alt="Logo trường THPT Hoài Đức A"
						width={80}
						height={80}
						className="rounded-full object-cover"
					/>
				</div>
				<div className="grid flex-1 text-left text-sm leading-tight">
					<span className="truncate font-semibold">{activeTeam.name}</span>
					<span className="truncate text-xs">
						{user?.username} - {user?.role}
					</span>
				</div>
			</button>
		</Link>
	);
}
