import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import CreateBookCategoryForm from './create-book-category-form';
import type { CreateBookCategoryRequest } from '@/types/book-categories';
import { Plus } from 'lucide-react';

interface BookCategoriesPageHeaderProps {
	isCreateSheetOpen: boolean;
	onCreateSheetOpenChange: (open: boolean) => void;
	onCreateCategory: (data: CreateBookCategoryRequest) => void;
	onCloseCreateSheet: () => void;
	isCreating: boolean;
	categories: any[];
}

export default function BookCategoriesPageHeader({
	isCreateSheetOpen,
	onCreateSheetOpenChange,
	onCreateCategory,
	onCloseCreateSheet,
	isCreating,
	categories,
}: BookCategoriesPageHeaderProps) {
	return (
		<div className="space-y-4 mb-10">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Quản lý Thể loại chi tiết</h1>
					<p className="text-muted-foreground">
						Tổ chức danh mục thể loại có phân cấp cha/con
					</p>
				</div>
				<Sheet open={isCreateSheetOpen} onOpenChange={onCreateSheetOpenChange}>
					<SheetTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Thêm thể loại
						</Button>
					</SheetTrigger>
					<SheetContent className="sm:max-w-xl">
						<SheetHeader>
							<SheetTitle>Thêm thể loại</SheetTitle>
						</SheetHeader>
						<div className="py-4 px-4">
							<CreateBookCategoryForm
								onSubmit={onCreateCategory}
								onCancel={onCloseCreateSheet}
								isLoading={isCreating}
								categories={categories}
							/>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
}
