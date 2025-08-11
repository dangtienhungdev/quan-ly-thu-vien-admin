import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	useBookCategories,
	useCreateBookCategory,
	useDeleteBookCategory,
	useUpdateBookCategory,
} from '@/hooks/book-categories';
import type {
	BookCategory,
	CreateBookCategoryRequest,
	UpdateBookCategoryRequest,
} from '@/types/book-categories';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import PaginationWrapper from '@/components/pagination-wrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateBookCategoryForm from './components/create-book-category-form';
import EditBookCategoryForm from './components/edit-book-category-form';

const BookCategoriesPage = () => {
	const [queryParams] = useSearchParams();
	const navigate = useNavigate();
	const page = queryParams.get('page');
	const limit = queryParams.get('limit');

	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [categoryToEdit, setCategoryToEdit] = useState<BookCategory | null>(
		null
	);
	const [categoryToDelete, setCategoryToDelete] = useState<BookCategory | null>(
		null
	);

	const { bookCategories, meta, isLoading, isError, error, refetch } =
		useBookCategories({
			params: {
				page: page ? Number(page) : 1,
				limit: limit ? Number(limit) : 10,
			},
		});

	const { createBookCategory, isCreating } = useCreateBookCategory({
		onSuccess: () => {
			setIsCreateSheetOpen(false);
			refetch();
		},
	});

	const { updateBookCategory, isUpdating } = useUpdateBookCategory({
		onSuccess: () => {
			setIsEditSheetOpen(false);
			setCategoryToEdit(null);
		},
	});

	const { deleteBookCategory, isDeleting } = useDeleteBookCategory({
		onSuccess: () => {
			setIsDeleteDialogOpen(false);
			setCategoryToDelete(null);
		},
	});

	const handleCreate = (data: CreateBookCategoryRequest) => {
		createBookCategory(data);
	};

	const openEdit = (c: BookCategory) => {
		setCategoryToEdit(c);
		setIsEditSheetOpen(true);
	};

	const handleUpdate = (data: UpdateBookCategoryRequest) => {
		if (!categoryToEdit) return;
		updateBookCategory({ id: categoryToEdit.id, data });
	};

	const openDelete = (c: BookCategory) => {
		setCategoryToDelete(c);
		setIsDeleteDialogOpen(true);
	};

	const handleDelete = () => {
		if (!categoryToDelete) return;
		deleteBookCategory(categoryToDelete.id);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Quản lý Thể loại chi tiết</h1>
					<p className="text-muted-foreground">
						Tổ chức danh mục thể loại có phân cấp cha/con
					</p>
				</div>
				<Button onClick={() => setIsCreateSheetOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Thêm thể loại
				</Button>
			</div>

			<Card>
				<CardContent>
					{isLoading ? (
						<div className="space-y-2">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					) : isError ? (
						<Alert variant="destructive">
							<AlertDescription>{(error as Error)?.message}</AlertDescription>
						</Alert>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Tên thể loại</TableHead>
										<TableHead>Thể loại cha</TableHead>
										<TableHead>Ngày tạo</TableHead>
										<TableHead className="w-[140px]">Hành động</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{bookCategories.map((c: BookCategory) => (
										<TableRow key={c.id}>
											<TableCell className="font-medium">{c.name}</TableCell>
											<TableCell>{c.parent?.name || '-'}</TableCell>
											<TableCell>
												{new Date(c.created_at).toLocaleDateString('vi-VN')}
											</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<Button
														size="icon"
														variant="outline"
														onClick={() => openEdit(c)}
													>
														<IconEdit size={16} />
													</Button>
													<Button
														size="icon"
														variant="destructive"
														onClick={() => openDelete(c)}
													>
														<IconTrash size={16} />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{meta && (
								<PaginationWrapper
									currentPage={meta.page}
									totalPages={meta.totalPages}
									onPageChange={(newPage) =>
										navigate(
											`/book-categories?page=${newPage}&limit=${meta.limit}`
										)
									}
									className="mt-4"
								/>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Create Sheet */}
			<Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
				<SheetContent className="sm:max-w-xl">
					<SheetHeader>
						<SheetTitle>Thêm thể loại</SheetTitle>
					</SheetHeader>
					<div className="py-4">
						<CreateBookCategoryForm
							onSubmit={handleCreate}
							onCancel={() => setIsCreateSheetOpen(false)}
							isLoading={isCreating}
							categories={(bookCategories || []).filter((c) => !c.parent_id)}
						/>
					</div>
				</SheetContent>
			</Sheet>

			{/* Edit Sheet */}
			<Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
				<SheetContent className="sm:max-w-xl">
					<SheetHeader>
						<SheetTitle>Chỉnh sửa thể loại</SheetTitle>
					</SheetHeader>
					<div className="py-4">
						{categoryToEdit && (
							<EditBookCategoryForm
								category={categoryToEdit}
								onSubmit={handleUpdate}
								onCancel={() => setIsEditSheetOpen(false)}
								isLoading={isUpdating}
								categories={bookCategories}
							/>
						)}
					</div>
				</SheetContent>
			</Sheet>

			{/* Delete Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xóa thể loại</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc muốn xóa thể loại
							<span className="font-semibold"> {categoryToDelete?.name}</span>?
							Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
							{isDeleting ? 'Đang xóa...' : 'Xóa'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default BookCategoriesPage;
