import instance from '@/configs/instances';
import type {
	BookGradeLevel,
	SetGradeLevelsForBookRequest,
	SetGradeLevelsForBookResponse,
} from '@/types/book-grade-levels';

export const BookGradeLevelsAPI = {
	create: async (data: BookGradeLevel): Promise<BookGradeLevel> => {
		const res = await instance.post('/api/book-grade-levels', data);
		return res.data;
	},

	remove: async (bookId: string, gradeLevelId: string): Promise<void> => {
		await instance.delete(`/api/book-grade-levels/${bookId}/${gradeLevelId}`);
	},

	getByBook: async (bookId: string): Promise<BookGradeLevel[]> => {
		const res = await instance.get(`/api/book-grade-levels/book/${bookId}`);
		return res.data;
	},

	getByGradeLevel: async (gradeLevelId: string): Promise<BookGradeLevel[]> => {
		const res = await instance.get(
			`/api/book-grade-levels/grade-level/${gradeLevelId}`
		);
		return res.data;
	},

	setForBook: async (
		data: SetGradeLevelsForBookRequest
	): Promise<SetGradeLevelsForBookResponse> => {
		const res = await instance.post(
			'/api/book-grade-levels/set-for-book',
			data
		);
		return res.data;
	},
};
