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
import { useAuthors } from '@/hooks/authors';
import { useBooks, useSearchBooks, useUpdateBook } from '@/hooks/books';
import { useCategories } from '@/hooks/categories';
import { usePublishers } from '@/hooks/publishers';
import type { Book, CreateBookRequest, UpdateBookRequest } from '@/types/books';
import {
	IconEdit,
	IconEye,
	IconPlus,
	IconRefresh,
	IconSearch,
	IconTrash,
} from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { BooksAPI } from '@/apis/books';
import BookCover from '@/components/book-cover';
import PaginationWrapper from '@/components/pagination-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { toast } from 'sonner';
import CreateBookForm from './components/create-book-form';
import EditBookForm from './components/edit-book-form';

const BooksPage = () => {
	const [queryParams] = useSearchParams();
	const navigate = useNavigate();
	const page = queryParams.get('page');
	const limit = queryParams.get('limit');
	const searchQuery = queryParams.get('q');
	const bookTypeFilter = queryParams.get('type');

	// State cho Sheet tạo book
	const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	// State cho dialog xóa book
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [bookToDelete, setBookToDelete] = useState<{
		id: string;
		title: string;
		isbn: string;
	} | null>(null);

	// State cho Sheet edit book
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

	// State cho search và filter
	const [searchTerm, setSearchTerm] = useState(searchQuery || '');
	const [selectedBookType, setSelectedBookType] = useState<string>(
		bookTypeFilter || 'all'
	);

	// Hook để cập nhật book
	const { updateBook, isUpdating } = useUpdateBook({
		onSuccess: () => {
			setIsEditSheetOpen(false);
			setBookToEdit(null);
		},
	});

	// Hook để lấy danh sách books
	const { books, meta, isLoading, isError, error, refetch } = useBooks({
		params: {
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 10,
			type:
				bookTypeFilter && bookTypeFilter !== 'all'
					? (bookTypeFilter as 'physical' | 'ebook')
					: undefined,
		},
		enabled: !searchQuery,
	});

	// Hook để tìm kiếm books
	const {
		books: searchResults,
		meta: searchMeta,
		isLoading: isSearching,
		isError: isSearchError,
		error: searchError,
	} = useSearchBooks({
		params: {
			q: searchQuery || '',
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 10,
		},
		enabled: !!searchQuery,
	});

	// Hook để lấy danh sách categories, publishers và authors cho form
	const { categories } = useCategories();
	const { publishers } = usePublishers();
	const { authors } = useAuthors();

	// Hàm xử lý tạo book
	const handleCreateBook = async (data: CreateBookRequest) => {
		try {
			setIsCreating(true);
			const newBook = await BooksAPI.create(data);
			toast.success(`Tạo sách ${newBook.title} thành công!`);
			setIsCreateSheetOpen(false);
			refetch();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo sách';
			toast.error(errorMessage);
		} finally {
			setIsCreating(false);
		}
	};

	// Hàm đóng Sheet
	const handleCloseSheet = () => {
		setIsCreateSheetOpen(false);
	};

	// Hàm mở dialog xóa book
	const handleOpenDeleteDialog = (book: {
		id: string;
		title: string;
		isbn: string;
	}) => {
		setBookToDelete(book);
		setIsDeleteDialogOpen(true);
	};

	// Hàm xử lý xóa book
	const handleDeleteBook = async () => {
		if (!bookToDelete) return;

		try {
			setIsDeleting(true);
			await BooksAPI.delete(bookToDelete.id);
			toast.success(`Xóa sách ${bookToDelete.title} thành công!`);
			setIsDeleteDialogOpen(false);
			setBookToDelete(null);
			refetch();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa sách';
			toast.error(errorMessage);
		} finally {
			setIsDeleting(false);
		}
	};

	// Hàm đóng dialog xóa
	const handleCloseDeleteDialog = () => {
		setIsDeleteDialogOpen(false);
		setBookToDelete(null);
	};

	// Hàm mở Sheet edit book
	const handleOpenEditSheet = (book: Book) => {
		setBookToEdit(book);
		setIsEditSheetOpen(true);
	};

	// Hàm xử lý cập nhật book
	const handleUpdateBook = (data: UpdateBookRequest) => {
		if (!bookToEdit) return;
		updateBook({ id: bookToEdit.id, data });
	};

	// Hàm đóng Sheet edit
	const handleCloseEditSheet = () => {
		setIsEditSheetOpen(false);
		setBookToEdit(null);
	};

	// Hàm xử lý thay đổi trang
	const handlePageChange = (newPage: number) => {
		const newParams = new URLSearchParams(queryParams);
		newParams.set('page', newPage.toString());
		navigate(`?${newParams.toString()}`);
	};

	// Hàm xử lý tìm kiếm
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const newParams = new URLSearchParams();
		if (searchTerm.trim()) {
			newParams.set('q', searchTerm.trim());
		}
		if (selectedBookType && selectedBookType !== 'all') {
			newParams.set('type', selectedBookType);
		}
		newParams.set('page', '1');
		navigate(`?${newParams.toString()}`);
	};

	// Hàm xử lý thay đổi filter loại sách
	const handleBookTypeFilterChange = (value: string) => {
		setSelectedBookType(value);
		const newParams = new URLSearchParams(queryParams);
		if (value && value !== 'all') {
			newParams.set('type', value);
		} else {
			newParams.delete('type');
		}
		newParams.set('page', '1');
		navigate(`?${newParams.toString()}`);
	};

	// Hàm xử lý xóa tìm kiếm và filter
	const handleClearSearch = () => {
		setSearchTerm('');
		setSelectedBookType('all');
		navigate('?page=1');
	};

	// Hàm xử lý navigate đến trang chi tiết sách
	const handleNavigateToBookDetail = (book: Book) => {
		if (book.book_type === 'ebook') {
			navigate(`/books/ebook/${book.id}`);
		} else {
			navigate(`/books/physical/${book.id}`);
		}
	};

	// Lấy dữ liệu hiện tại
	const currentBooks = searchQuery ? searchResults : books;
	const currentMeta = searchQuery ? searchMeta : meta;
	const currentIsLoading = searchQuery ? isSearching : isLoading;
	const currentIsError = searchQuery ? isSearchError : isError;
	const currentError = searchQuery ? searchError : error;

	const getBookTypeBadgeVariant = (
		bookType: string
	): 'secondary' | 'default' | 'outline' => {
		switch (bookType) {
			case 'physical':
				return 'default';
			case 'ebook':
				return 'secondary';
			default:
				return 'outline';
		}
	};

	const getBookTypeLabel = (bookType: string): string => {
		switch (bookType) {
			case 'physical':
				return 'Sách vật lý';
			case 'ebook':
				return 'Sách điện tử';
			default:
				return 'Không xác định';
		}
	};

	const getPhysicalTypeLabel = (physicalType: string): string => {
		switch (physicalType) {
			case 'borrowable':
				return 'Có thể mượn';
			case 'library_use':
				return 'Chỉ đọc tại thư viện';
			default:
				return 'Không xác định';
		}
	};

	if (currentIsLoading) {
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

	if (currentIsError) {
		return (
			<div className="container mx-auto py-6">
				<Alert variant="destructive">
					<AlertDescription>
						Failed to load books: {currentError?.message || 'Unknown error'}
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
				<h1 className="text-2xl font-bold tracking-tight">Quản lý sách</h1>
				<div className="flex items-center space-x-2">
					<Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
						<SheetTrigger asChild>
							<Button>
								<IconPlus className="mr-2 h-4 w-4" />
								Thêm sách
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[400px] sm:w-[540px]">
							<SheetHeader>
								<SheetTitle>Thêm sách mới</SheetTitle>
							</SheetHeader>
							<div className="px-4 py-4">
								<CreateBookForm
									onSubmit={handleCreateBook}
									onCancel={handleCloseSheet}
									isLoading={isCreating}
									categories={categories}
									publishers={publishers}
									authors={authors}
								/>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>

			{/* Search Bar và Filter */}
			<div className="mb-4 space-y-4">
				<form onSubmit={handleSearch} className="flex space-x-2">
					<div className="flex-1">
						<Input
							placeholder="Tìm kiếm sách theo tên, ISBN..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<Button type="submit" disabled={!searchTerm.trim()}>
						<IconSearch className="mr-2 h-4 w-4" />
						Tìm kiếm
					</Button>
					{(searchQuery || bookTypeFilter) && (
						<Button type="button" variant="outline" onClick={handleClearSearch}>
							Xóa bộ lọc
						</Button>
					)}
				</form>

				{/* Filter loại sách */}
				<div className="flex items-center space-x-2">
					<label className="text-sm font-medium">Loại sách:</label>
					<Select
						value={selectedBookType}
						onValueChange={handleBookTypeFilterChange}
					>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Tất cả loại sách" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả loại sách</SelectItem>
							<SelectItem value="physical">Sách vật lý</SelectItem>
							<SelectItem value="ebook">Sách điện tử</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Hiển thị thông tin filter hiện tại */}
				{(searchQuery || bookTypeFilter) && (
					<div className="flex items-center space-x-2 text-sm text-muted-foreground">
						<span>Bộ lọc hiện tại:</span>
						{searchQuery && (
							<Badge variant="outline" className="text-xs">
								Tìm kiếm: "{searchQuery}"
							</Badge>
						)}
						{bookTypeFilter && (
							<Badge variant="outline" className="text-xs">
								Loại: {getBookTypeLabel(bookTypeFilter)}
							</Badge>
						)}
					</div>
				)}
			</div>

			<div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Ảnh bìa</TableHead>
							<TableHead>Tên sách</TableHead>
							<TableHead>ISBN</TableHead>
							<TableHead>Tác giả</TableHead>
							<TableHead>Loại sách</TableHead>
							<TableHead>Thể loại</TableHead>
							<TableHead>Nhà xuất bản</TableHead>
							<TableHead>Năm xuất bản</TableHead>
							<TableHead className="text-right">Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentBooks.length === 0 ? (
							<TableRow>
								<TableCell colSpan={9} className="text-center py-8">
									{searchQuery || bookTypeFilter
										? 'Không tìm thấy sách nào phù hợp với bộ lọc'
										: 'Không có sách nào'}
								</TableCell>
							</TableRow>
						) : (
							currentBooks.map((book) => (
								<TableRow key={book.id}>
									<TableCell>
										<BookCover
											src={book.cover_image}
											alt={book.title}
											size="md"
										/>
									</TableCell>
									<TableCell className="font-medium">
										<div className="flex flex-col">
											<button
												onClick={() => handleNavigateToBookDetail(book)}
												className="text-left font-semibold hover:text-blue-600 hover:underline transition-colors cursor-pointer"
											>
												{book.title}
											</button>
											{book.description && (
												<span className="text-sm text-muted-foreground line-clamp-2">
													{book.description}
												</span>
											)}
										</div>
									</TableCell>
									<TableCell className="font-mono text-sm">
										{book.isbn}
									</TableCell>
									<TableCell>
										{book.authors && book.authors.length > 0 ? (
											<div className="space-y-1">
												{book.authors.map((author) => (
													<div key={author.id} className="text-sm">
														{author.author_name}
													</div>
												))}
											</div>
										) : (
											<span className="text-muted-foreground text-sm">-</span>
										)}
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<Badge variant={getBookTypeBadgeVariant(book.book_type)}>
												{getBookTypeLabel(book.book_type)}
											</Badge>
											{book.book_type === 'physical' && (
												<div className="text-xs text-muted-foreground">
													{getPhysicalTypeLabel(book.physical_type)}
												</div>
											)}
										</div>
									</TableCell>
									<TableCell>{book.category?.category_name || '-'}</TableCell>
									<TableCell>{book.publisher?.publisherName || '-'}</TableCell>
									<TableCell>{book.publish_year}</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end space-x-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleOpenEditSheet(book)}
												className="h-8 w-8 p-0 text-primary hover:text-primary"
											>
												<IconEdit className="h-4 w-4" />
												<span className="sr-only">Chỉnh sửa sách</span>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleNavigateToBookDetail(book)}
												className="h-8 w-8 p-0 text-blue-600 hover:text-blue-600"
											>
												<IconEye className="h-4 w-4" />
												<span className="sr-only">Xem chi tiết sách</span>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													handleOpenDeleteDialog({
														id: book.id,
														title: book.title,
														isbn: book.isbn,
													})
												}
												className="h-8 w-8 p-0 text-destructive hover:text-destructive"
											>
												<IconTrash className="h-4 w-4" />
												<span className="sr-only">Xóa sách</span>
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>

				{currentMeta && (
					<div className="mt-4 space-y-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground text-center">
							Showing {currentBooks.length} of {currentMeta.totalItems} books
							{currentMeta.totalPages > 1 && (
								<span>
									{' '}
									(Page {currentMeta.page} of {currentMeta.totalPages})
								</span>
							)}
						</div>

						<div>
							{currentMeta.totalPages > 1 && (
								<PaginationWrapper
									currentPage={currentMeta.page}
									totalPages={currentMeta.totalPages}
									onPageChange={handlePageChange}
								/>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Dialog xác nhận xóa book */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa sách</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa sách{' '}
							<strong>{bookToDelete?.title}</strong>?
							<br />
							<strong>ISBN:</strong> {bookToDelete?.isbn}
							<br />
							Hành động này không thể hoàn tác và sẽ xóa tất cả bản sao vật lý
							và ebook liên quan.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCloseDeleteDialog}>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteBook}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? 'Đang xóa...' : 'Xóa'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Sheet edit book */}
			<Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
				<SheetContent side="right" className="w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>Chỉnh sửa sách {bookToEdit?.title}</SheetTitle>
					</SheetHeader>
					<div className="px-4 py-4">
						{bookToEdit && (
							<EditBookForm
								book={bookToEdit}
								onSubmit={handleUpdateBook}
								onCancel={handleCloseEditSheet}
								isLoading={isUpdating}
								categories={categories}
								publishers={publishers}
								authors={authors}
							/>
						)}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
};

export default BooksPage;
