import { BooksAPI } from '@/apis/books';
import { PhysicalCopiesAPI } from '@/apis/physical-copies';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type {
	CopyCondition,
	CopyStatus,
	CreatePhysicalCopyRequest,
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
	CreatePhysicalCopyDialog,
	PhysicalDetailHeader,
	PhysicalListCard,
} from './components';

const PhysicalBookDetailPage = () => {
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

	// Fetch physical copies for this book
	const {
		data: physicalCopiesData,
		isLoading: isLoadingCopies,
		error: copiesError,
	} = useQuery({
		queryKey: ['physical-copies-book', id],
		queryFn: () => PhysicalCopiesAPI.getByBook(id!),
		enabled: !!id,
	});

	// Create physical copy mutation
	const createPhysicalCopyMutation = useMutation({
		mutationFn: (data: CreatePhysicalCopyRequest) =>
			PhysicalCopiesAPI.create(data),
		onSuccess: () => {
			toast.success('Tạo bản sao thành công!');
			queryClient.invalidateQueries({ queryKey: ['physical-copies-book', id] });
			setShowCreateDialog(false);
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi tạo bản sao');
		},
	});

	// Update status mutation
	const updateStatusMutation = useMutation({
		mutationFn: ({ copyId, status }: { copyId: string; status: CopyStatus }) =>
			PhysicalCopiesAPI.updateStatus(copyId, { status }),
		onSuccess: () => {
			toast.success('Cập nhật trạng thái thành công!');
			queryClient.invalidateQueries({ queryKey: ['physical-copies-book', id] });
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
		},
	});

	// Update condition mutation
	const updateConditionMutation = useMutation({
		mutationFn: ({
			copyId,
			condition,
		}: {
			copyId: string;
			condition: CopyCondition;
		}) => PhysicalCopiesAPI.updateCondition(copyId, { condition }),
		onSuccess: () => {
			toast.success('Cập nhật tình trạng thành công!');
			queryClient.invalidateQueries({ queryKey: ['physical-copies-book', id] });
		},
		onError: (error: any) => {
			toast.error(error.message || 'Có lỗi xảy ra khi cập nhật tình trạng');
		},
	});

	const handleCreatePhysicalCopy = async (data: CreatePhysicalCopyRequest) => {
		createPhysicalCopyMutation.mutate(data);
	};

	const handleUpdateStatus = (copyId: string, status: CopyStatus) => {
		updateStatusMutation.mutate({ copyId, status });
	};

	const handleUpdateCondition = (copyId: string, condition: CopyCondition) => {
		updateConditionMutation.mutate({ copyId, condition });
	};

	const handleCreateNew = () => {
		setShowCreateDialog(true);
	};

	if (isLoadingBook || isLoadingCopies) {
		return (
			<div className="container mx-auto p-6 space-y-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (bookError || copiesError) {
		return (
			<div className="container mx-auto p-6">
				<Alert variant="destructive">
					<AlertDescription>
						{(bookError || copiesError)?.message ||
							'Có lỗi xảy ra khi tải dữ liệu'}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const physicalCopies = physicalCopiesData?.data || [];

	return (
		<div className="space-y-6">
			{/* Header */}
			<PhysicalDetailHeader />

			{/* Book Information */}
			<div className="bg-white rounded-lg shadow p-6">
				<h2 className="text-xl font-semibold mb-4">Thông tin sách</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 className="font-semibold text-lg">{book?.title}</h3>
						<p className="text-muted-foreground">ISBN: {book?.isbn}</p>
						{book?.description && (
							<p className="text-sm mt-2">{book.description}</p>
						)}
					</div>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Tác giả:</span>
							<span>
								{book?.authors
									?.map((author) => author.author_name)
									.join(', ') || 'Chưa có'}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Thể loại:</span>
							<span>{book?.category?.category_name || 'Chưa có'}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Nhà xuất bản:</span>
							<span>{book?.publisher?.publisherName || 'Chưa có'}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Năm xuất bản:</span>
							<span>{book?.publish_year}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Physical Copies Section */}
			<PhysicalListCard
				physicalCopies={physicalCopies}
				onCreateNew={handleCreateNew}
				onUpdateStatus={handleUpdateStatus}
				onUpdateCondition={handleUpdateCondition}
			/>

			{/* Create Physical Copy Dialog */}
			<CreatePhysicalCopyDialog
				open={showCreateDialog}
				onOpenChange={setShowCreateDialog}
				bookId={id!}
				bookTitle={book?.title}
				onSubmit={handleCreatePhysicalCopy}
				isLoading={createPhysicalCopyMutation.isPending}
			/>
		</div>
	);
};

export default PhysicalBookDetailPage;
