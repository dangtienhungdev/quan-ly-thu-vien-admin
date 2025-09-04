import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';

import type { UserRole } from '@/types/user.type';
import { memo } from 'react';
import EditUserForm from './edit-user-form';

interface UserToEdit {
	id: string;
	userCode: string;
	username: string;
	email: string;
	role: UserRole;
	accountStatus: 'active' | 'inactive' | 'banned';
}

interface EditUserSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userToEdit: UserToEdit | null;
	onSubmit: (data: any) => void;
	onCancel: () => void;
	isLoading: boolean;
}

export const EditUserSheet = memo<EditUserSheetProps>(
	({ open, onOpenChange, userToEdit, onSubmit, onCancel, isLoading }) => {
		return (
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetContent side="right" className="w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>Chỉnh sửa người dùng {userToEdit?.userCode}</SheetTitle>
					</SheetHeader>
					<div className="px-4">
						{userToEdit && (
							<EditUserForm
								user={userToEdit}
								onSubmit={onSubmit}
								onCancel={onCancel}
								isLoading={isLoading}
							/>
						)}
					</div>
				</SheetContent>
			</Sheet>
		);
	}
);

EditUserSheet.displayName = 'EditUserSheet';
