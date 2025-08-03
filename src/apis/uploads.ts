import type {
	UpdateUploadRequest,
	UploadResponse,
	UploadsResponse,
} from '@/types';
import instance from '../configs/instances';

export const UploadsAPI = {
	// Upload file PDF
	upload: async (data: FormData): Promise<UploadResponse> => {
		const res = await instance.post('/api/uploads/upload', data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return res.data;
	},

	// Get all uploads
	getAll: async (): Promise<UploadsResponse> => {
		const res = await instance.get('/api/uploads');
		return res.data;
	},

	// Get upload by ID
	getById: async (id: string): Promise<UploadResponse> => {
		const res = await instance.get(`/api/uploads/${id}`);
		return res.data;
	},

	// Get upload by slug
	getBySlug: async (slug: string): Promise<UploadResponse> => {
		const res = await instance.get(`/api/uploads/slug/${slug}`);
		return res.data;
	},

	// Download file by ID
	downloadById: async (id: string): Promise<Blob> => {
		const res = await instance.get(`/api/uploads/${id}/download`, {
			responseType: 'blob',
		});
		return res.data;
	},

	// Download file by slug
	downloadBySlug: async (slug: string): Promise<Blob> => {
		const res = await instance.get(`/api/uploads/slug/${slug}/download`, {
			responseType: 'blob',
		});
		return res.data;
	},

	// Import file from files directory
	importFile: async (fileName: string): Promise<UploadResponse> => {
		const res = await instance.post(`/api/uploads/import/${fileName}`);
		return res.data;
	},

	// Import all PDF files
	importAll: async (): Promise<UploadsResponse> => {
		const res = await instance.post('/api/uploads/import-all');
		return res.data;
	},

	// Update upload
	update: async (
		id: string,
		data: UpdateUploadRequest
	): Promise<UploadResponse> => {
		const res = await instance.patch(`/api/uploads/${id}`, data);
		return res.data;
	},

	// Delete upload
	delete: async (id: string): Promise<void> => {
		await instance.delete(`/api/uploads/${id}`);
	},

	// Get file URL for direct access
	getFileUrl: (filePath: string): string => {
		return `${instance.defaults.baseURL}/api/uploads/file/${filePath}`;
	},

	// Get simple file URL
	getSimpleFileUrl: (fileName: string): string => {
		return `${instance.defaults.baseURL}/api/uploads/f/${fileName}`;
	},
};
