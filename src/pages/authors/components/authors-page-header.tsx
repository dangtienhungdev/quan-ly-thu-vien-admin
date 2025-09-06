import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { memo } from 'react';
import CreateAuthorForm from './create-author-form';

interface AuthorsPageHeaderProps {
	isCreateSheetOpen: boolean;
	onCreateSheetOpenChange: (open: boolean) => void;
	onCreateAuthor: (data: any) => void;
	onCloseCreateSheet: () => void;
	isCreating: boolean;
}

const AuthorsPageHeader = memo<AuthorsPageHeaderProps>(
	({
		isCreateSheetOpen,
		onCreateSheetOpenChange,
		onCreateAuthor,
		onCloseCreateSheet,
		isCreating,
	}) => {
		return (
			<div className="mb-2 flex items-center justify-between space-y-2">
				<h1 className="text-2xl font-bold tracking-tight">Quản lý tác giả</h1>
				<div className="flex items-center space-x-2">
					<Sheet
						open={isCreateSheetOpen}
						onOpenChange={onCreateSheetOpenChange}
					>
						<SheetTrigger asChild>
							<Button>
								<IconPlus className="mr-2 h-4 w-4" />
								Thêm tác giả
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[400px] sm:w-[540px]">
							<SheetHeader>
								<SheetTitle>Thêm tác giả mới</SheetTitle>
							</SheetHeader>
							<div className="px-4">
								<CreateAuthorForm
									onSubmit={onCreateAuthor}
									onCancel={onCloseCreateSheet}
									isLoading={isCreating}
								/>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		);
	}
);

AuthorsPageHeader.displayName = 'AuthorsPageHeader';

export default AuthorsPageHeader;
