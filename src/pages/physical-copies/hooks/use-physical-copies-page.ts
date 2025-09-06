import type {
	CopyCondition,
	CopyStatus,
	CreatePhysicalCopyRequest,
	PhysicalCopy,
	UpdatePhysicalCopyRequest,
} from '@/types';
import { LocationsAPI, PhysicalCopiesAPI } from '@/apis';
import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

export const usePhysicalCopiesPage = () => {
	// State
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [selectedCondition, setSelectedCondition] = useState<string>('all');
	const [selectedLocation, setSelectedLocation] = useState<string>('all');
	const [activeTab, setActiveTab] = useState('all');

	// UI States
	const [openCreateSheet, setOpenCreateSheet] = useState(false);
	const [openEditSheet, setOpenEditSheet] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openUpdateStatusDialog, setOpenUpdateStatusDialog] = useState(false);
	const [selectedCopy, setSelectedCopy] = useState<PhysicalCopy | null>(null);

	// Queries
	const { data: locationsData } = useQuery({
		queryKey: ['locations-active'],
		queryFn: () => LocationsAPI.getActiveLocations(),
	});

	const { data: copiesData, isLoading: isLoadingCopies } = useQuery({
		queryKey: [
			'physical-copies',
			{
				search: searchQuery,
				status: selectedStatus,
				condition: selectedCondition,
				location: selectedLocation,
			},
		],
		queryFn: () => {
			if (searchQuery) {
				return PhysicalCopiesAPI.search({ q: searchQuery, page: 1, limit: 20 });
			}
			return PhysicalCopiesAPI.getAll({ page: 1, limit: 20 });
		},
	});

	const { data: availableCopies } = useQuery({
		queryKey: ['physical-copies-available'],
		queryFn: () => PhysicalCopiesAPI.getAvailable({ page: 1, limit: 10 }),
	});

	const { data: maintenanceCopies } = useQuery({
		queryKey: ['physical-copies-maintenance'],
		queryFn: () => PhysicalCopiesAPI.getMaintenance({ page: 1, limit: 10 }),
	});

	const { data: stats } = useQuery({
		queryKey: ['physical-copies-stats'],
		queryFn: () => PhysicalCopiesAPI.getStats(),
	});

	// Mutations
	const queryClient = useQueryClient();

	const createCopyMutation = useMutation({
		mutationFn: (data: CreatePhysicalCopyRequest) =>
			PhysicalCopiesAPI.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['physical-copies'] });
			queryClient.invalidateQueries({ queryKey: ['physical-copies-stats'] });
			toast.success('Tạo bản sao thành công!');
			setOpenCreateSheet(false);
		},
		onError: (error: unknown) => {
			toast.error(
				(error as any)?.response?.data?.message ||
					'Có lỗi xảy ra khi tạo bản sao'
			);
		},
	});

	const updateCopyMutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: UpdatePhysicalCopyRequest;
		}) => PhysicalCopiesAPI.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['physical-copies'] });
			queryClient.invalidateQueries({ queryKey: ['physical-copies-stats'] });
			toast.success('Cập nhật bản sao thành công!');
			setOpenEditSheet(false);
		},
		onError: (error: unknown) => {
			toast.error(
				(error as any)?.response?.data?.message ||
					'Có lỗi xảy ra khi cập nhật bản sao'
			);
		},
	});

	const deleteCopyMutation = useMutation({
		mutationFn: (id: string) => PhysicalCopiesAPI.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['physical-copies'] });
			queryClient.invalidateQueries({ queryKey: ['physical-copies-stats'] });
			toast.success('Xóa bản sao thành công!');
			setOpenDeleteDialog(false);
		},
		onError: (error: unknown) => {
			toast.error(
				(error as any)?.response?.data?.message ||
					'Có lỗi xảy ra khi xóa bản sao'
			);
		},
	});

	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: CopyStatus }) =>
			PhysicalCopiesAPI.updateStatus(id, { status }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['physical-copies'] });
			queryClient.invalidateQueries({ queryKey: ['physical-copies-stats'] });
			toast.success('Cập nhật trạng thái thành công!');
			setOpenUpdateStatusDialog(false);
		},
		onError: (error: unknown) => {
			toast.error(
				(error as any)?.response?.data?.message ||
					'Có lỗi xảy ra khi cập nhật trạng thái'
			);
		},
	});

	// Event handlers
	const handleCreateCopy = useCallback(
		(data: CreatePhysicalCopyRequest) => {
			createCopyMutation.mutate(data);
		},
		[createCopyMutation]
	);

	const handleUpdateCopy = useCallback(
		(data: UpdatePhysicalCopyRequest) => {
			if (selectedCopy) {
				updateCopyMutation.mutate({ id: selectedCopy.id, data });
			}
		},
		[updateCopyMutation, selectedCopy]
	);

	const handleDeleteCopy = useCallback(() => {
		if (selectedCopy) {
			deleteCopyMutation.mutate(selectedCopy.id);
		}
	}, [deleteCopyMutation, selectedCopy]);

	const handleEditCopy = useCallback((copy: PhysicalCopy) => {
		setSelectedCopy(copy);
		setOpenEditSheet(true);
	}, []);

	const handleDeleteClick = useCallback((copy: PhysicalCopy) => {
		setSelectedCopy(copy);
		setOpenDeleteDialog(true);
	}, []);

	const handleUpdateStatusClick = useCallback((copy: PhysicalCopy) => {
		setSelectedCopy(copy);
		setOpenUpdateStatusDialog(true);
	}, []);

	const handleUpdateStatus = useCallback(
		(copyId: string, newStatus: CopyStatus) => {
			updateStatusMutation.mutate({ id: copyId, status: newStatus });
		},
		[updateStatusMutation]
	);

	// Utility functions
	const getStatusColor = useCallback((status: CopyStatus) => {
		const colors: Record<CopyStatus, string> = {
			available: 'bg-green-100 text-green-800',
			borrowed: 'bg-blue-100 text-blue-800',
			reserved: 'bg-yellow-100 text-yellow-800',
			damaged: 'bg-red-100 text-red-800',
			lost: 'bg-gray-100 text-gray-800',
			maintenance: 'bg-orange-100 text-orange-800',
		};
		return colors[status];
	}, []);

	const getConditionColor = useCallback((condition: CopyCondition) => {
		const colors: Record<CopyCondition, string> = {
			new: 'bg-green-100 text-green-800',
			good: 'bg-blue-100 text-blue-800',
			worn: 'bg-yellow-100 text-yellow-800',
			damaged: 'bg-red-100 text-red-800',
		};
		return colors[condition];
	}, []);

	const getStatusIcon = useCallback((status: CopyStatus) => {
		switch (status) {
			case 'available':
				return '✓';
			case 'borrowed':
				return '📖';
			case 'reserved':
				return '⚠️';
			case 'damaged':
			case 'lost':
			case 'maintenance':
				return '🔧';
			default:
				return null;
		}
	}, []);

	const formatCurrency = useCallback((amount: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(amount);
	}, []);

	return {
		// State
		searchQuery,
		selectedStatus,
		selectedCondition,
		selectedLocation,
		activeTab,
		openCreateSheet,
		openEditSheet,
		openDeleteDialog,
		openUpdateStatusDialog,
		selectedCopy,

		// Data
		locationsData,
		copiesData,
		isLoadingCopies,
		availableCopies,
		maintenanceCopies,
		stats,

		// Mutations
		createCopyMutation,
		updateCopyMutation,
		deleteCopyMutation,
		updateStatusMutation,

		// Setters
		setSearchQuery,
		setSelectedStatus,
		setSelectedCondition,
		setSelectedLocation,
		setActiveTab,
		setOpenCreateSheet,
		setOpenEditSheet,
		setOpenDeleteDialog,
		setOpenUpdateStatusDialog,

		// Handlers
		handleCreateCopy,
		handleUpdateCopy,
		handleDeleteCopy,
		handleEditCopy,
		handleDeleteClick,
		handleUpdateStatusClick,
		handleUpdateStatus,

		// Utilities
		getStatusColor,
		getConditionColor,
		getStatusIcon,
		formatCurrency,
	};
};
