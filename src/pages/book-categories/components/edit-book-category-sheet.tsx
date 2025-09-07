import type {
	BookCategory,
	UpdateBookCategoryRequest,
} from '@/types/book-categories';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';

import EditBookCategoryForm from './edit-book-category-form';

interface EditBookCategorySheetProps {
	isOpen: boolean;
	categoryToEdit: BookCategory | null;
	onOpenChange: (open: boolean) => void;
	onUpdateCategory: (data: UpdateBookCategoryRequest) => void;
	onClose: () => void;
	isUpdating: boolean;
	categories: BookCategory[];
}

export default function EditBookCategorySheet({
	isOpen,
	categoryToEdit,
	onOpenChange,
	onUpdateCategory,
	onClose,
	isUpdating,
	categories,
}: EditBookCategorySheetProps) {
	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent className="sm:max-w-xl">
				<SheetHeader>
					<SheetTitle>Chỉnh sửa thể loại</SheetTitle>
				</SheetHeader>
				<div className="py-4 px-4">
					{categoryToEdit && (
						<EditBookCategoryForm
							category={categoryToEdit}
							onSubmit={onUpdateCategory}
							onCancel={onClose}
							isLoading={isUpdating}
							categories={categories}
						/>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
