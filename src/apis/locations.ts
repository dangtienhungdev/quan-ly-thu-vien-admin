import type {
	CreateLocationData,
	Location,
	LocationSearchParams,
	LocationStats,
	UpdateLocationData,
} from '@/types';

import type { PaginatedResponse } from '@/types';
import instance from '@/configs/instances';

export const LocationsAPI = {
	// Lấy danh sách tất cả vị trí
	getAll: async (
		params: LocationSearchParams = {}
	): Promise<PaginatedResponse<Location>> => {
		const res = await instance.get('/api/locations', { params });
		return res.data;
	},

	// Tìm kiếm vị trí
	search: async (
		params: LocationSearchParams
	): Promise<PaginatedResponse<Location>> => {
		const res = await instance.get('/api/locations/search', { params });
		return res.data;
	},

	// Lấy vị trí theo ID
	getById: async (id: string): Promise<Location> => {
		const res = await instance.get(`/api/locations/${id}`);
		return res.data;
	},

	// Lấy vị trí theo slug
	getBySlug: async (slug: string): Promise<Location> => {
		const res = await instance.get(`/api/locations/slug/${slug}`);
		return res.data;
	},

	// Tạo vị trí mới
	create: async (locationData: CreateLocationData): Promise<Location> => {
		const res = await instance.post('/api/locations', locationData);
		return res.data;
	},

	// Cập nhật vị trí theo ID
	update: async (
		id: string,
		locationData: UpdateLocationData
	): Promise<Location> => {
		const res = await instance.patch(`/api/locations/${id}`, locationData);
		return res.data;
	},

	// Cập nhật vị trí theo slug
	updateBySlug: async (
		slug: string,
		locationData: UpdateLocationData
	): Promise<Location> => {
		const res = await instance.patch(
			`/api/locations/slug/${slug}`,
			locationData
		);
		return res.data;
	},

	// Xóa vị trí theo ID
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/locations/${id}`);
	},

	// Xóa vị trí theo slug
	deleteBySlug: async (slug: string): Promise<void> => {
		await instance.delete(`/api/locations/slug/${slug}`);
	},

	// Lấy thống kê vị trí
	getStats: async (): Promise<LocationStats> => {
		const res = await instance.get('/api/locations/stats');
		return res.data;
	},

	// Lấy danh sách vị trí đang hoạt động (cho dropdown)
	getActiveLocations: async (): Promise<Location[]> => {
		const res = await instance.get('/api/locations', {
			params: {
				limit: 1000,
			},
		});
		return res.data.data;
	},
};
