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
	useCreateGradeLevel,
	useDeleteGradeLevel,
	useGradeLevels,
	useUpdateGradeLevel,
} from '@/hooks/grade-levels';
import type {
	CreateGradeLevelRequest,
	GradeLevel,
	UpdateGradeLevelRequest,
} from '@/types/grade-levels';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import PaginationWrapper from '@/components/pagination-wrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateGradeLevelForm from './components/create-grade-level-form';
import EditGradeLevelForm from './components/edit-grade-level-form';

const GradeLevelsPage = () => {
	const [queryParams] = useSearchParams();
	const navigate = useNavigate();
	const page = queryParams.get('page');
	const limit = queryParams.get('limit');

	// Create sheet state
	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

	// Delete dialog state
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [gradeLevelToDelete, setGradeLevelToDelete] = useState<{
		id: string;
		name: string;
		description?: string;
	} | null>(null);

	// Edit sheet state
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [gradeLevelToEdit, setGradeLevelToEdit] = useState<GradeLevel | null>(
		null
	);

	const { gradeLevels, meta, isLoading, isError, error, refetch } =
		useGradeLevels({
			params: {
				page: page ? Number(page) : 1,
				limit: limit ? Number(limit) : 10,
			},
		});

	const { createGradeLevel, isCreating } = useCreateGradeLevel({
		onSuccess: () => {
			setIsCreateSheetOpen(false);
			refetch();
		},
	});

	const { updateGradeLevel, isUpdating } = useUpdateGradeLevel({
		onSuccess: () => {
			setIsEditSheetOpen(false);
			setGradeLevelToEdit(null);
		},
	});

	const { deleteGradeLevel, isDeleting } = useDeleteGradeLevel({
		onSuccess: () => {
			setIsDeleteDialogOpen(false);
			setGradeLevelToDelete(null);
		},
	});

	// Create
	const handleCreate = (data: CreateGradeLevelRequest) => {
		createGradeLevel(data);
	};

	// Open Edit
	const handleOpenEditSheet = (grade: GradeLevel) => {
		setGradeLevelToEdit(grade);
		setIsEditSheetOpen(true);
	};

	// Update
	const handleUpdate = (data: UpdateGradeLevelRequest) => {
		if (!gradeLevelToEdit) return;
		updateGradeLevel({ id: gradeLevelToEdit.id, data });
	};

	// Open Delete dialog
	const handleOpenDeleteDialog = (grade: { id: string; name: string }) => {
		setGradeLevelToDelete(grade);
		setIsDeleteDialogOpen(true);
	};

	// Delete
	const handleDelete = () => {
		if (!gradeLevelToDelete) return;
		deleteGradeLevel(gradeLevelToDelete.id);
	};

	const handleCloseDeleteDialog = () => {
		setIsDeleteDialogOpen(false);
		setGradeLevelToDelete(null);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Quản lý Khối lớp</h1>
					<p className="text-muted-foreground">
						Tạo và quản lý danh mục khối/lớp áp dụng cho sách
					</p>
				</div>
				<Button onClick={() => setIsCreateSheetOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Thêm khối lớp
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
										<TableHead>Tên khối lớp</TableHead>
										<TableHead>Mô tả</TableHead>
										<TableHead>Thứ tự</TableHead>
										<TableHead className="w-[140px]">Hành động</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{gradeLevels.map((grade: GradeLevel) => (
										<TableRow key={grade.id}>
											<TableCell className="font-medium">
												{grade.name}
											</TableCell>
											<TableCell>{grade.description || '-'}</TableCell>
											<TableCell>{grade.order}</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<Button
														size="icon"
														variant="outline"
														onClick={() => handleOpenEditSheet(grade)}
													>
														<IconEdit size={16} />
													</Button>
													<Button
														size="icon"
														variant="destructive"
														onClick={() => handleOpenDeleteDialog(grade)}
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
											`/grade-levels?page=${newPage}&limit=${meta.limit}`
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
						<SheetTitle>Thêm khối lớp</SheetTitle>
					</SheetHeader>
					<div className="py-4">
						<CreateGradeLevelForm
							onSubmit={handleCreate}
							onCancel={() => setIsCreateSheetOpen(false)}
							isLoading={isCreating}
						/>
					</div>
				</SheetContent>
			</Sheet>

			{/* Edit Sheet */}
			<Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
				<SheetContent className="sm:max-w-xl">
					<SheetHeader>
						<SheetTitle>Chỉnh sửa khối lớp</SheetTitle>
					</SheetHeader>
					<div className="py-4">
						{gradeLevelToEdit && (
							<EditGradeLevelForm
								gradeLevel={gradeLevelToEdit}
								onSubmit={handleUpdate}
								onCancel={() => setIsEditSheetOpen(false)}
								isLoading={isUpdating}
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
						<AlertDialogTitle>Xóa khối lớp</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc muốn xóa khối lớp
							<span className="font-semibold"> {gradeLevelToDelete?.name}</span>
							? Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCloseDeleteDialog}>
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

export default GradeLevelsPage;
