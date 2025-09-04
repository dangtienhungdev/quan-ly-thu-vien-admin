import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { IconPlus, IconUpload } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import type { UserRole } from '@/types/user.type';
import { getUserTypeLabel } from '@/utils/user-utils';
import { memo } from 'react';
import CreateUserForm from './create-user-form';
import ImportUsersForm from './import-users-form';

interface ActionButtonsProps {
	type: string | null;
	isCreateSheetOpen: boolean;
	setIsCreateSheetOpen: (open: boolean) => void;
	isImportSheetOpen: boolean;
	setIsImportSheetOpen: (open: boolean) => void;
	onCreateUser: (data: any) => void;
	onImportUsers: (data: any[]) => void;
	onCloseCreateSheet: () => void;
	isCreating: boolean;
	isImporting: boolean;
}

export const ActionButtons = memo<ActionButtonsProps>(
	({
		type,
		isCreateSheetOpen,
		setIsCreateSheetOpen,
		isImportSheetOpen,
		setIsImportSheetOpen,
		onCreateUser,
		onImportUsers,
		onCloseCreateSheet,
		isCreating,
		isImporting,
	}) => {
		return (
			<div className="flex items-center space-x-2">
				<Sheet open={isImportSheetOpen} onOpenChange={setIsImportSheetOpen}>
					<SheetTrigger asChild>
						<Button variant="outline">
							<IconUpload className="mr-2 h-4 w-4" />
							Import Excel
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="!w-[70vw] !max-w-[70vw]">
						<SheetHeader>
							<SheetTitle>Import người dùng từ Excel</SheetTitle>
						</SheetHeader>
						<div className="px-4">
							<ImportUsersForm
								onSubmit={onImportUsers}
								onCancel={() => setIsImportSheetOpen(false)}
								isLoading={isImporting}
							/>
						</div>
					</SheetContent>
				</Sheet>

				<Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
					<SheetTrigger asChild>
						<Button>
							<IconPlus className="mr-2 h-4 w-4" />
							Thêm {getUserTypeLabel(type || 'reader')}
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-[400px] sm:w-[540px]">
						<SheetHeader>
							<SheetTitle>
								Thêm {getUserTypeLabel(type || 'reader')} mới
							</SheetTitle>
						</SheetHeader>
						<div className="px-4 h-full">
							<CreateUserForm
								onSubmit={onCreateUser}
								onCancel={onCloseCreateSheet}
								isLoading={isCreating}
								defaultRole={(type as UserRole) || 'reader'}
							/>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		);
	}
);

ActionButtons.displayName = 'ActionButtons';
