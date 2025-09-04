import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useState } from 'react';

export function ProfileDropdown() {
	const { user, logout } = useAuth();
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="relative bg-transparent hover:bg-transparent"
					>
						<div className="flex flex-col items-end space-y-1">
							<p className="text-xs leading-none font-medium">
								{user?.username}
							</p>
							<p className="text-muted-foreground text-[10px] leading-none">
								{user?.email}
							</p>
						</div>
						<Avatar className="h-8 w-8 rounded-full">
							<AvatarImage src="/avatars/01.png" alt="@shadcn" />
							<AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm leading-none font-medium">
								{user?.username}
							</p>
							<p className="text-muted-foreground text-xs leading-none">
								{user?.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{/* <DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link to="/settings">
								Profile
								<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup> */}
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => setShowLogoutDialog(true)}>
						Đăng xuất
						<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmDialog
				open={showLogoutDialog}
				onOpenChange={setShowLogoutDialog}
				title="Xác nhận đăng xuất"
				desc="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
				cancelBtnText="Hủy"
				confirmText="Đăng xuất"
				destructive={false}
				handleConfirm={() => {
					logout();
					setShowLogoutDialog(false);
				}}
			/>
		</>
	);
}
