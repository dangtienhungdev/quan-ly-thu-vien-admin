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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUpdateUser, useUsers } from '@/hooks';
import type {
	CreateUserRequest,
	UpdateUserRequest,
	UserRole,
} from '@/types/user.type';
import {
	IconEdit,
	IconPlus,
	IconRefresh,
	IconTrash,
} from '@tabler/icons-react';
import {
	createSearchParams,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';

import { UsersAPI } from '@/apis/users';
import PaginationWrapper from '@/components/pagination-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { toast } from 'sonner';
import CreateUserForm from './components/create-user-form';
import EditUserForm from './components/edit-user-form';

const UserPage = () => {
	const [queryParams] = useSearchParams();
	const navigate = useNavigate();
	const type = queryParams.get('type');
	const page = queryParams.get('page');
	const limit = queryParams.get('limit');

	// State cho Sheet tạo người dùng
	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	// State cho dialog xóa người dùng
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [userToDelete, setUserToDelete] = useState<{
		id: string;
		userCode: string;
		username: string;
	} | null>(null);

	// State cho Sheet edit người dùng
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [userToEdit, setUserToEdit] = useState<{
		id: string;
		userCode: string;
		username: string;
		email: string;
		role: UserRole;
		accountStatus: 'active' | 'inactive' | 'banned';
	} | null>(null);

	// Hook để cập nhật người dùng
	const { updateUser, isUpdating } = useUpdateUser({
		onSuccess: () => {
			setIsEditSheetOpen(false);
			setUserToEdit(null);
		},
	});

	const params: any = {
		page: page ? Number(page) : 1,
		limit: limit ? Number(limit) : 10,
	};

	if (type) {
		params.type = type as UserRole;
	}

	const { users, meta, isLoading, isError, error, refetch } = useUsers({
		params,
	});

	// Hàm xử lý khi tab thay đổi
	const handleTabChange = (value: string) => {
		const newType = value === 'admin' ? 'admin' : 'reader';
		navigate(`?type=${newType}`);
	};

	// Hàm xử lý tạo người dùng
	const handleCreateUser = async (data: CreateUserRequest) => {
		try {
			setIsCreating(true);
			const newUser = await UsersAPI.create(data);
			toast.success(
				`Tạo ${
					data.role === 'admin' ? 'nhân viên' : 'người dùng'
				} thành công! Mã: ${newUser.userCode}`
			);
			setIsCreateSheetOpen(false);
			refetch(); // Refresh danh sách người dùng
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi tạo người dùng';
			toast.error(errorMessage);
		} finally {
			setIsCreating(false);
		}
	};

	// Hàm đóng Sheet
	const handleCloseSheet = () => {
		setIsCreateSheetOpen(false);
	};

	// Hàm mở dialog xóa người dùng
	const handleOpenDeleteDialog = (user: {
		id: string;
		userCode: string;
		username: string;
	}) => {
		setUserToDelete(user);
		setIsDeleteDialogOpen(true);
	};

	// Hàm xử lý xóa người dùng
	const handleDeleteUser = async () => {
		if (!userToDelete) return;

		try {
			setIsDeleting(true);
			await UsersAPI.delete(userToDelete.id);
			toast.success(`Xóa người dùng ${userToDelete.userCode} thành công!`);
			setIsDeleteDialogOpen(false);
			setUserToDelete(null);
			refetch(); // Refresh danh sách người dùng
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Có lỗi xảy ra khi xóa người dùng';
			toast.error(errorMessage);
		} finally {
			setIsDeleting(false);
		}
	};

	// Hàm đóng dialog xóa
	const handleCloseDeleteDialog = () => {
		setIsDeleteDialogOpen(false);
		setUserToDelete(null);
	};

	// Hàm mở Sheet edit người dùng
	const handleOpenEditSheet = (user: {
		id: string;
		userCode: string;
		username: string;
		email: string;
		role: UserRole;
		accountStatus: 'active' | 'inactive' | 'banned';
	}) => {
		setUserToEdit(user);
		setIsEditSheetOpen(true);
	};

	// Hàm xử lý cập nhật người dùng
	const handleUpdateUser = (data: UpdateUserRequest) => {
		if (!userToEdit) return;
		updateUser({ id: userToEdit.id, data });
	};

	// Hàm đóng Sheet edit
	const handleCloseEditSheet = () => {
		setIsEditSheetOpen(false);
		setUserToEdit(null);
	};

	// Hàm xử lý thay đổi trang
	const handlePageChange = (newPage: number) => {
		navigate({
			pathname: '/users',
			search: createSearchParams({
				page: newPage.toString(),
				type: type || 'reader',
			}).toString(),
		});
	};

	const getRoleBadgeVariant = (role: string) => {
		switch (role) {
			case 'admin':
				return 'destructive';
			case 'user':
				return 'default';
			default:
				return 'secondary';
		}
	};

	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case 'active':
				return 'default';
			case 'inactive':
				return 'secondary';
			case 'banned':
				return 'destructive';
			default:
				return 'outline';
		}
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
						Failed to load users: {error?.message || 'Unknown error'}
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
				<h1 className="text-2xl font-bold tracking-tight">
					Quản lý người dùng
				</h1>
				<div className="flex items-center space-x-2">
					<Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
						<SheetTrigger asChild>
							<Button>
								<IconPlus className="mr-2 h-4 w-4" />
								Thêm {type === 'admin' ? 'nhân viên' : 'người dùng'}
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[400px] sm:w-[540px]">
							<SheetHeader>
								<SheetTitle>
									Thêm {type === 'admin' ? 'nhân viên' : 'người dùng'} mới
								</SheetTitle>
							</SheetHeader>
							<div className="px-4">
								<CreateUserForm
									onSubmit={handleCreateUser}
									onCancel={handleCloseSheet}
									isLoading={isCreating}
									defaultRole={(type as UserRole) || 'reader'}
								/>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>

			<Tabs
				orientation="vertical"
				value={type || 'reader'}
				onValueChange={handleTabChange}
				className="space-y-4"
			>
				<div className="w-full overflow-x-auto pb-2">
					<TabsList>
						<TabsTrigger value="reader">Độc giả</TabsTrigger>
						<TabsTrigger value="admin">Quản trị viên</TabsTrigger>
					</TabsList>
				</div>
			</Tabs>

			<div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Mã</TableHead>
							<TableHead>Username</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center py-8">
									No users found
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-medium">{user.userCode}</TableCell>
									<TableCell>{user.username}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										<Badge variant={getRoleBadgeVariant(user.role)}>
											{user.role}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge variant={getStatusBadgeVariant(user.accountStatus)}>
											{user.accountStatus}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end space-x-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													handleOpenEditSheet({
														id: user.id,
														userCode: user.userCode,
														username: user.username,
														email: user.email,
														role: user.role,
														accountStatus: user.accountStatus,
													})
												}
												className="h-8 w-8 p-0 text-primary hover:text-primary"
											>
												<IconEdit className="h-4 w-4" />
												<span className="sr-only">Chỉnh sửa người dùng</span>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													handleOpenDeleteDialog({
														id: user.id,
														userCode: user.userCode,
														username: user.username,
													})
												}
												className="h-8 w-8 p-0 text-destructive hover:text-destructive"
											>
												<IconTrash className="h-4 w-4" />
												<span className="sr-only">Xóa người dùng</span>
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
							Showing {users.length} of {meta.totalItems} users
							{meta.totalPages > 1 && (
								<span>
									{' '}
									(Page {meta.page} of {meta.totalPages})
								</span>
							)}
						</div>

						{meta.totalPages > 1 && (
							<div className="w-fit">
								<PaginationWrapper
									currentPage={meta.page}
									totalPages={meta.totalPages}
									onPageChange={handlePageChange}
								/>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Dialog xác nhận xóa người dùng */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa người dùng{' '}
							<strong>{userToDelete?.userCode}</strong> (
							{userToDelete?.username})?
							<br />
							Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCloseDeleteDialog}>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteUser}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? 'Đang xóa...' : 'Xóa'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Sheet edit người dùng */}
			<Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
				<SheetContent side="right" className="w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>Chỉnh sửa người dùng {userToEdit?.userCode}</SheetTitle>
					</SheetHeader>
					<div className="px-4">
						{userToEdit && (
							<EditUserForm
								user={userToEdit}
								onSubmit={handleUpdateUser}
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

export default UserPage;
