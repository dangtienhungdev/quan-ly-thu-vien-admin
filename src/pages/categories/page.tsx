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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
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
	useCategories,
	useMainCategories,
	useUpdateCategory,
} from '@/hooks/categories';
import type {
	Category,
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from '@/types/categories';
import {
	IconChevronDown,
	IconChevronRight,
	IconEdit,
	IconPlus,
	IconRefresh,
	IconTrash,
} from '@tabler/icons-react';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { CategoriesAPI } from '@/apis/categories';
import PaginationWrapper from '@/components/pagination-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import CreateCategoryForm from './components/create-category-form';
import EditCategoryForm from './components/edit-category-form';

const CategoriesPage = () => {
	const [queryParams] = useSearchParams();
	const navigate = useNavigate();
	const page = queryParams.get('page');
	const limit = queryParams.get('limit');

	// State cho Sheet tạo category
	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	// State cho dialog xóa category
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState<{
		id: string;
		category_name: string;
		description?: string;
	} | null>(null);

	// State cho Sheet edit category
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

	// State cho expandable table
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

	// Hook để cập nhật category
	const { updateCategory, isUpdating } = useUpdateCategory({
		onSuccess: () => {
			setIsEditSheetOpen(false);
			setCategoryToEdit(null);
		},
	});

	const { categories, meta, isLoading, isError, error, refetch } =
		useCategories({
			params: {
				page: page ? Number(page) : 1,
				limit: limit ? Number(limit) : 10,
			},
		});

	// Hook để lấy danh sách main categories cho form
	const { mainCategories } = useMainCategories();

	// Hàm xử lý tạo category
	const handleCreateCategory = async (data: CreateCategoryRequest) => {
		try {
			setIsCreating(true);
			const newCategory = await CategoriesAPI.create(data);
			toast.success(`Tạo danh mục ${newCategory.category_name} thành công!`);
			setIsCreateSheetOpen(false);
			refetch();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi tạo danh mục';
			toast.error(errorMessage);
		} finally {
			setIsCreating(false);
		}
	};

	// Hàm đóng Sheet
	const handleCloseSheet = () => {
		setIsCreateSheetOpen(false);
	};

	// Hàm mở dialog xóa category
	const handleOpenDeleteDialog = (category: {
		id: string;
		category_name: string;
		description?: string;
	}) => {
		setCategoryToDelete(category);
		setIsDeleteDialogOpen(true);
	};

	// Hàm xử lý xóa category
	const handleDeleteCategory = async () => {
		if (!categoryToDelete) return;

		try {
			setIsDeleting(true);
			await CategoriesAPI.delete(categoryToDelete.id);
			toast.success(
				`Xóa danh mục ${categoryToDelete.category_name} thành công!`
			);
			setIsDeleteDialogOpen(false);
			setCategoryToDelete(null);
			refetch();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi xóa danh mục';
			toast.error(errorMessage);
		} finally {
			setIsDeleting(false);
		}
	};

	// Hàm đóng dialog xóa
	const handleCloseDeleteDialog = () => {
		setIsDeleteDialogOpen(false);
		setCategoryToDelete(null);
	};

	// Hàm mở Sheet edit category
	const handleOpenEditSheet = (category: Category) => {
		setCategoryToEdit(category);
		setIsEditSheetOpen(true);
	};

	// Hàm xử lý cập nhật category
	const handleUpdateCategory = (data: UpdateCategoryRequest) => {
		if (!categoryToEdit) return;
		updateCategory({ id: categoryToEdit.id, data });
	};

	// Hàm đóng Sheet edit
	const handleCloseEditSheet = () => {
		setIsEditSheetOpen(false);
		setCategoryToEdit(null);
	};

	// Hàm xử lý thay đổi trang
	const handlePageChange = (newPage: number) => {
		const newParams = new URLSearchParams(queryParams);
		newParams.set('page', newPage.toString());
		navigate(`?${newParams.toString()}`);
	};

	// Hàm xử lý expand/collapse row
	const toggleRowExpansion = (categoryId: string) => {
		const newExpandedRows = new Set(expandedRows);
		if (newExpandedRows.has(categoryId)) {
			newExpandedRows.delete(categoryId);
		} else {
			newExpandedRows.add(categoryId);
		}
		setExpandedRows(newExpandedRows);
	};

	// Hàm lấy danh sách con của một category
	const getChildren = (categoryId: string): Category[] => {
		return categories.filter((cat) => cat.parent_id === categoryId);
	};

	// Hàm lấy danh sách categories cha (không có parent_id)
	const getParentCategories = (): Category[] => {
		return categories.filter((cat) => !cat.parent_id);
	};

	const getCategoryTypeBadgeVariant = (
		category: Category
	): 'secondary' | 'default' => {
		return category.parent_id ? 'secondary' : 'default';
	};

	const getCategoryTypeLabel = (category: Category): string => {
		return category.parent_id ? 'Danh mục con' : 'Danh mục chính';
	};

	// Component render row cho category
	const renderCategoryRow = (
		category: Category,
		level: number = 0
	): React.ReactElement => {
		const isExpanded = expandedRows.has(category.id);
		const children = getChildren(category.id);
		const hasChildCategories = children.length > 0;

		return (
			<>
				<TableRow key={category.id} className={level > 0 ? 'bg-muted/30' : ''}>
					<TableCell className="font-medium">
						<div className="flex items-center space-x-2">
							{level > 0 && (
								<div className="flex space-x-1">
									{Array.from({ length: level }).map((_, index) => (
										<div key={index} className="w-4 h-px bg-border" />
									))}
								</div>
							)}
							{hasChildCategories && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => toggleRowExpansion(category.id)}
									className="h-6 w-6 p-0"
								>
									{isExpanded ? (
										<IconChevronDown className="h-4 w-4" />
									) : (
										<IconChevronRight className="h-4 w-4" />
									)}
								</Button>
							)}
							{!hasChildCategories && level > 0 && <div className="w-6" />}
							<span className={level > 0 ? 'text-sm' : ''}>
								{category.category_name}
							</span>
						</div>
					</TableCell>
					<TableCell className="font-mono text-sm">{category.slug}</TableCell>
					<TableCell>
						<Badge variant={getCategoryTypeBadgeVariant(category)}>
							{getCategoryTypeLabel(category)}
						</Badge>
					</TableCell>
					<TableCell>{category.parent?.category_name || '-'}</TableCell>
					<TableCell className="max-w-xs truncate">
						{category.description || '-'}
					</TableCell>
					<TableCell className="text-right">
						<div className="flex justify-end space-x-1">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleOpenEditSheet(category)}
								className="h-8 w-8 p-0 text-primary hover:text-primary"
							>
								<IconEdit className="h-4 w-4" />
								<span className="sr-only">Chỉnh sửa danh mục</span>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() =>
									handleOpenDeleteDialog({
										id: category.id,
										category_name: category.category_name,
										description: category.description,
									})
								}
								className="h-8 w-8 p-0 text-destructive hover:text-destructive"
							>
								<IconTrash className="h-4 w-4" />
								<span className="sr-only">Xóa danh mục</span>
							</Button>
						</div>
					</TableCell>
				</TableRow>
				{isExpanded && hasChildCategories && (
					<>{children.map((child) => renderCategoryRow(child, level + 1))}</>
				)}
			</>
		);
	};

	if (isLoading) {
		return (
			<div className="container mx-auto py-6">
				<Card>
					<CardHeader>
						<Skeleton className="h-8 w-48" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="container mx-auto py-6">
				<Alert variant="destructive">
					<AlertDescription>
						Failed to load categories: {error?.message || 'Unknown error'}
					</AlertDescription>
				</Alert>
				<Button onClick={() => refetch()} className="mt-4">
					<IconRefresh className="mr-2 h-4 w-4" />
					Retry
				</Button>
			</div>
		);
	}

	const parentCategories = getParentCategories();

	return (
		<>
			<div className="mb-2 flex items-center justify-between space-y-2">
				<h1 className="text-2xl font-bold tracking-tight">Quản lý danh mục</h1>
				<div className="flex items-center space-x-2">
					<Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
						<SheetTrigger asChild>
							<Button>
								<IconPlus className="mr-2 h-4 w-4" />
								Thêm danh mục
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[400px] sm:w-[540px]">
							<SheetHeader>
								<SheetTitle>Thêm danh mục mới</SheetTitle>
							</SheetHeader>
							<div className="px-4">
								<CreateCategoryForm
									onSubmit={handleCreateCategory}
									onCancel={handleCloseSheet}
									isLoading={isCreating}
									mainCategories={mainCategories}
								/>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>

			<div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tên danh mục</TableHead>
							<TableHead>Slug</TableHead>
							<TableHead>Loại</TableHead>
							<TableHead>Danh mục cha</TableHead>
							<TableHead>Mô tả</TableHead>
							<TableHead className="text-right">Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{parentCategories.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-8">
									Không tìm thấy danh mục nào
								</TableCell>
							</TableRow>
						) : (
							parentCategories.map((category) => renderCategoryRow(category))
						)}
					</TableBody>
				</Table>

				{meta && (
					<div className="mt-4 space-y-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground text-center">
							Hiển thị {categories.length} trên {meta.totalItems} danh mục
							{meta.totalPages > 1 && (
								<span>
									{' '}
									(Trang {meta.page} trên {meta.totalPages})
								</span>
							)}
						</div>

						<div>
							{meta.totalPages > 1 && (
								<PaginationWrapper
									currentPage={meta.page}
									totalPages={meta.totalPages}
									onPageChange={handlePageChange}
								/>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Dialog xác nhận xóa category */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa danh mục{' '}
							<strong>{categoryToDelete?.category_name}</strong>?
							<br />
							Hành động này không thể hoàn tác.
							{categoryToDelete?.description && (
								<>
									<br />
									<strong>Mô tả:</strong> {categoryToDelete.description}
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCloseDeleteDialog}>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteCategory}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? 'Đang xóa...' : 'Xóa'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Sheet edit category */}
			<Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
				<SheetContent side="right" className="w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>
							Chỉnh sửa danh mục {categoryToEdit?.category_name}
						</SheetTitle>
					</SheetHeader>
					<div className="px-4">
						{categoryToEdit && (
							<EditCategoryForm
								category={categoryToEdit}
								onSubmit={handleUpdateCategory}
								onCancel={handleCloseEditSheet}
								isLoading={isUpdating}
								mainCategories={mainCategories}
							/>
						)}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
};

export default CategoriesPage;
