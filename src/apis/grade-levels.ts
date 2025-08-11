import instance from '@/configs/instances';
import type { PaginatedResponse } from '@/types/common';
import type {
	CreateGradeLevelRequest,
	GradeLevel,
	PaginationGradeLevelQuery,
	SearchGradeLevelQuery,
	UpdateGradeLevelRequest,
} from '@/types/grade-levels';

export const GradeLevelsAPI = {
	getAll: async (
		params?: PaginationGradeLevelQuery
	): Promise<PaginatedResponse<GradeLevel>> => {
		const res = await instance.get('/api/grade-levels', { params });
		return res.data;
	},

	getAllNoPaginate: async (): Promise<GradeLevel[]> => {
		const res = await instance.get('/api/grade-levels/all');
		return res.data;
	},

	search: async (
		params: SearchGradeLevelQuery
	): Promise<PaginatedResponse<GradeLevel>> => {
		const res = await instance.get('/api/grade-levels/search', { params });
		return res.data;
	},

	getById: async (id: string): Promise<GradeLevel> => {
		const res = await instance.get(`/api/grade-levels/${id}`);
		return res.data;
	},

	create: async (data: CreateGradeLevelRequest): Promise<GradeLevel> => {
		const res = await instance.post('/api/grade-levels', data);
		return res.data;
	},

	update: async (
		id: string,
		data: UpdateGradeLevelRequest
	): Promise<GradeLevel> => {
		const res = await instance.patch(`/api/grade-levels/${id}`, data);
		return res.data;
	},

	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/grade-levels/${id}`);
	},
};
