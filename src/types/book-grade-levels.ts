export type BookGradeLevel = {
	book_id: string;
	grade_level_id: string;
};

export type SetGradeLevelsForBookRequest = {
	book_id: string;
	grade_level_ids: string[];
};

export type SetGradeLevelsForBookResponse = SetGradeLevelsForBookRequest;
