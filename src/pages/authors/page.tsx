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
import { useAuthors, useUpdateAuthor } from '@/hooks/authors';
import type {
	Author,
	CreateAuthorRequest,
	UpdateAuthorRequest,
} from '@/types/authors';
import {
	IconEdit,
	IconPlus,
	IconRefresh,
	IconTrash,
} from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AuthorsAPI } from '@/apis/authors';
import PaginationWrapper from '@/components/pagination-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { toast } from 'sonner';
import CreateAuthorForm from './components/create-author-form';
import EditAuthorForm from './components/edit-author-form';

const AuthorsPage = () => {
	const [queryParams] = useSearchParams();
	const navigate = useNavigate();
	const page = queryParams.get('page');
	const limit = queryParams.get('limit');

	// State cho Sheet tạo author
	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	// State cho dialog xóa author
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [authorToDelete, setAuthorToDelete] = useState<{
		id: string;
		author_name: string;
		bio?: string;
	} | null>(null);

	// State cho Sheet edit author
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [authorToEdit, setAuthorToEdit] = useState<Author | null>(null);

	// Hook để cập nhật author
	const { updateAuthor, isUpdating } = useUpdateAuthor({
		onSuccess: () => {
			setIsEditSheetOpen(false);
			setAuthorToEdit(null);
		},
	});

	const { authors, meta, isLoading, isError, error, refetch } = useAuthors({
		params: {
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 10,
		},
	});

	// Hàm xử lý tạo author
	const handleCreateAuthor = async (data: CreateAuthorRequest) => {
		try {
			setIsCreating(true);
			const newAuthor = await AuthorsAPI.create(data);
			toast.success(`Tạo tác giả ${newAuthor.author_name} thành công!`);
			setIsCreateSheetOpen(false);
			refetch();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi tạo tác giả';
			toast.error(errorMessage);
		} finally {
			setIsCreating(false);
		}
	};

	// Hàm đóng Sheet
	const handleCloseSheet = () => {
		setIsCreateSheetOpen(false);
	};

	// Hàm mở dialog xóa author
	const handleOpenDeleteDialog = (author: {
		id: string;
		author_name: string;
		bio?: string;
	}) => {
		setAuthorToDelete(author);
		setIsDeleteDialogOpen(true);
	};

	// Hàm xử lý xóa author
	const handleDeleteAuthor = async () => {
		if (!authorToDelete) return;

		try {
			setIsDeleting(true);
			await AuthorsAPI.delete(authorToDelete.id);
			toast.success(`Xóa tác giả ${authorToDelete.author_name} thành công!`);
			setIsDeleteDialogOpen(false);
			setAuthorToDelete(null);
			refetch();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi xóa tác giả';
			toast.error(errorMessage);
		} finally {
			setIsDeleting(false);
		}
	};

	// Hàm đóng dialog xóa
	const handleCloseDeleteDialog = () => {
		setIsDeleteDialogOpen(false);
		setAuthorToDelete(null);
	};

	// Hàm mở Sheet edit author
	const handleOpenEditSheet = (author: Author): void => {
		setAuthorToEdit(author);
		setIsEditSheetOpen(true);
	};

	// Hàm xử lý cập nhật author
	const handleUpdateAuthor = (data: UpdateAuthorRequest) => {
		if (!authorToEdit) return;
		updateAuthor({ id: authorToEdit.id, data });
	};

	// Hàm đóng Sheet edit
	const handleCloseEditSheet = () => {
		setIsEditSheetOpen(false);
		setAuthorToEdit(null);
	};

	// Hàm xử lý thay đổi trang
	const handlePageChange = (newPage: number) => {
		const newParams = new URLSearchParams(queryParams);
		newParams.set('page', newPage.toString());
		navigate(`?${newParams.toString()}`);
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
						Failed to load authors: {error?.message || 'Unknown error'}
					</AlertDescription>
				</Alert>
				<Button onClick={() => refetch()} className="mt-4">
					<IconRefresh className="mr-2 h-4 w-4" />
					Retry
				</Button>
			</div>
		);
	}

	return (
		<>
			<div className="mb-2 flex items-center justify-between space-y-2">
				<h1 className="text-2xl font-bold tracking-tight">Quản lý tác giả</h1>
				<div className="flex items-center space-x-2">
					<Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
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
									onSubmit={handleCreateAuthor}
									onCancel={handleCloseSheet}
									isLoading={isCreating}
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
							<TableHead>Tên tác giả</TableHead>
							<TableHead>Slug</TableHead>
							<TableHead>Quốc tịch</TableHead>
							<TableHead>Tiểu sử</TableHead>
							<TableHead className="text-right">Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{authors.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-8">
									Không tìm thấy tác giả nào
								</TableCell>
							</TableRow>
						) : (
							authors.map((author) => (
								<TableRow key={author.id}>
									<TableCell className="font-medium">
										{author.author_name}
									</TableCell>
									<TableCell className="font-mono text-sm">
										{author.slug}
									</TableCell>
									<TableCell>
										<Badge variant="outline">{author.nationality}</Badge>
									</TableCell>
									<TableCell className="max-w-xs truncate">
										{author.bio || '-'}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end space-x-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleOpenEditSheet(author)}
												className="h-8 w-8 p-0 text-primary hover:text-primary"
											>
												<IconEdit className="h-4 w-4" />
												<span className="sr-only">Chỉnh sửa tác giả</span>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													handleOpenDeleteDialog({
														id: author.id,
														author_name: author.author_name,
														bio: author.bio,
													})
												}
												className="h-8 w-8 p-0 text-destructive hover:text-destructive"
											>
												<IconTrash className="h-4 w-4" />
												<span className="sr-only">Xóa tác giả</span>
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>

				{meta && (
					<div className="mt-4 space-y-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground text-center">
							Showing {authors.length} of {meta.totalItems} authors
							{meta.totalPages > 1 && (
								<span>
									{' '}
									(Page {meta.page} of {meta.totalPages})
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

			{/* Dialog xác nhận xóa author */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa tác giả</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa tác giả{' '}
							<strong>{authorToDelete?.author_name}</strong>?
							<br />
							Hành động này không thể hoàn tác.
							{authorToDelete?.bio && (
								<>
									<br />
									<strong>Tiểu sử:</strong> {authorToDelete.bio}
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCloseDeleteDialog}>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteAuthor}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? 'Đang xóa...' : 'Xóa'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Sheet edit author */}
			<Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
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
								onSubmit={handleUpdateAuthor}
								onCancel={handleCloseEditSheet}
								isLoading={isUpdating}
							/>
						)}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
};

export default AuthorsPage;
