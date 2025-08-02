import instance from '../configs/instances';

export interface Image {
	id: string;
	originalName: string;
	fileName: string;
	slug: string;
	cloudinaryUrl: string;
	cloudinaryPublicId: string;
	fileSize: number;
	mimeType: string;
	width?: number;
	height?: number;
	format: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateImageRequest {
	file: File;
}

export interface UpdateImageRequest {
	imageName?: string;
}

export interface ImageUrlResponse {
	url: string;
	publicId: string;
}

export interface ImageTransformResponse {
	url: string;
}

export type ImagesResponse = Image[];
export type ImageResponse = Image;

export const ImagesAPI = {
	// Upload image to Cloudinary
	upload: async (data: FormData): Promise<ImageResponse> => {
		const res = await instance.post('/api/images/upload', data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return res.data;
	},

	// Get all images
	getAll: async (): Promise<ImagesResponse> => {
		const res = await instance.get('/api/images');
		return res.data;
	},

	// Get image by ID
	getById: async (id: string): Promise<ImageResponse> => {
		const res = await instance.get(`/api/images/${id}`);
		return res.data;
	},

	// Get image by slug
	getBySlug: async (slug: string): Promise<ImageResponse> => {
		const res = await instance.get(`/api/images/slug/${slug}`);
		return res.data;
	},

	// Get image URL by ID
	getUrlById: async (id: string): Promise<ImageUrlResponse> => {
		const res = await instance.get(`/api/images/${id}/url`);
		return res.data;
	},

	// Get image URL by slug
	getUrlBySlug: async (slug: string): Promise<ImageUrlResponse> => {
		const res = await instance.get(`/api/images/slug/${slug}/url`);
		return res.data;
	},

	// Get image with transformation by ID
	getTransformById: async (id: string): Promise<ImageTransformResponse> => {
		const res = await instance.get(`/api/images/${id}/transform`);
		return res.data;
	},

	// Get image with transformation by slug
	getTransformBySlug: async (slug: string): Promise<ImageTransformResponse> => {
		const res = await instance.get(`/api/images/slug/${slug}/transform`);
		return res.data;
	},

	// Update image
	update: async (
		id: string,
		data: UpdateImageRequest
	): Promise<ImageResponse> => {
		const res = await instance.patch(`/api/images/${id}`, data);
		return res.data;
	},

	// Delete image
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/images/${id}`);
	},
};
