import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	BookInfoCard,
	CreateEBookDialog,
	EBookDetailHeader,
	EBookListCard,
} from '@/pages/books/ebook/[id]/components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { BooksAPI } from '@/apis/books';
import { EBooksAPI } from '@/apis/ebooks';
import { Skeleton } from '@/components/ui/skeleton';
import type { CreateEBookRequest } from '@/types';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const EBookDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	// Fetch book details
	const {
		data: book,
		isLoading: isLoadingBook,
		error: bookError,
	} = useQuery({
		queryKey: ['book', id],
		queryFn: () => BooksAPI.getById(id!),
		enabled: !!id,
	});

	// Fetch ebooks for this book
	const {
		data: ebooksData,
		isLoading: isLoadingEbooks,
		error: ebooksError,
	} = useQuery({
		queryKey: ['ebooks-book', id],
		queryFn: () => EBooksAPI.getByBook(id!),
		enabled: !!id,
	});

	// Create ebook mutation
	const createEBookMutation = useMutation({
		mutationFn: (data: CreateEBookRequest) => EBooksAPI.create(data),
		onSuccess: () => {
			toast.success('Tạo ebook thành công!');
			queryClient.invalidateQueries({ queryKey: ['ebooks-book', id] });
			setShowCreateDialog(false);
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi tạo ebook');
		},
	});

	// Increment download mutation
	const incrementDownloadMutation = useMutation({
		mutationFn: (ebookId: string) => EBooksAPI.incrementDownloads(ebookId),
		onSuccess: () => {
			toast.success('Đã ghi nhận lượt tải!');
			queryClient.invalidateQueries({ queryKey: ['ebooks-book', id] });
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra');
		},
	});

	const handleCreateEBook = async (data: CreateEBookRequest) => {
		createEBookMutation.mutate(data);
	};

	const handleDownload = (ebookId: string) => {
		incrementDownloadMutation.mutate(ebookId);
		// TODO: Implement actual download logic
		toast.info('Tính năng tải xuống sẽ được phát triển');
	};

	const handleCreateNew = () => {
		setShowCreateDialog(true);
	};

	if (isLoadingBook || isLoadingEbooks) {
		return (
			<div className="container mx-auto p-6 space-y-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (bookError || ebooksError) {
		return (
			<div className="container mx-auto p-6">
				<Alert variant="destructive">
					<AlertDescription>
						{(bookError || ebooksError)?.message ||
							'Có lỗi xảy ra khi tải dữ liệu'}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const ebooks = ebooksData?.data || [];

	return (
		<div className="space-y-6">
			{/* Header */}
			<EBookDetailHeader />

			{/* Book Information */}
			<BookInfoCard book={book} />

			{/* EBooks Section */}
			<EBookListCard
				ebooks={ebooks}
				onCreateNew={handleCreateNew}
				onDownload={handleDownload}
			/>

			{/* Create EBook Dialog */}
			<CreateEBookDialog
				open={showCreateDialog}
				onOpenChange={setShowCreateDialog}
				bookId={id!}
				bookTitle={book?.title}
				onSubmit={handleCreateEBook}
				isLoading={createEBookMutation.isPending}
			/>
		</div>
	);
};

export default EBookDetailPage;
