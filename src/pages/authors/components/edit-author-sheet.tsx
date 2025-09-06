import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';

import type { Author } from '@/types/authors';
import { memo } from 'react';
import EditAuthorForm from './edit-author-form';

interface EditAuthorSheetProps {
	isOpen: boolean;
	authorToEdit: Author | null;
	onOpenChange: (open: boolean) => void;
	onUpdateAuthor: (data: any) => void;
	onClose: () => void;
	isUpdating: boolean;
}

const EditAuthorSheet = memo<EditAuthorSheetProps>(
	({
		isOpen,
		authorToEdit,
		onOpenChange,
		onUpdateAuthor,
		onClose,
		isUpdating,
	}) => {
		return (
			<Sheet open={isOpen} onOpenChange={onOpenChange}>
				<SheetContent side="right" className="w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>
							Chỉnh sửa tác giả {authorToEdit?.author_name}
						</SheetTitle>
					</SheetHeader>
					<div className="px-4">
						{authorToEdit && (
							<EditAuthorForm
								author={authorToEdit}
								onSubmit={onUpdateAuthor}
								onCancel={onClose}
								isLoading={isUpdating}
							/>
						)}
					</div>
				</SheetContent>
			</Sheet>
		);
	}
);

EditAuthorSheet.displayName = 'EditAuthorSheet';

export default EditAuthorSheet;
