export interface Location {
	id: string;
	name: string;
	slug: string;
	description?: string;
	floor?: number;
	section?: string;
	shelf?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateLocationData {
	name: string;
	description?: string;
	floor?: number;
	section?: string;
	shelf?: string;
	isActive?: boolean;
}

export interface UpdateLocationData {
	name?: string;
	description?: string;
	floor?: number;
	section?: string;
	shelf?: string;
	isActive?: boolean;
}

export interface LocationFormData {
	name: string;
	description: string;
	floor: string;
	section: string;
	shelf: string;
	isActive: boolean;
}

export interface LocationSearchParams {
	page?: number;
	limit?: number;
	q?: string;
}

export interface LocationStats {
	total: number;
	active: number;
	inactive: number;
	byFloor: Array<{
		floor: number;
		count: number;
	}>;
	bySection: Array<{
		section: string;
		count: number;
	}>;
}
