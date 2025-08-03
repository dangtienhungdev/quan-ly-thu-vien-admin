export interface Upload {
	id: string;
	originalName: string;
	fileName: string;
	slug: string;
	filePath: string;
	fileSize: number;
	mimeType: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateUploadRequest {
	file: File;
	fileName?: string;
}

export interface UpdateUploadRequest {
	fileName?: string;
}

export type UploadsResponse = Upload[];
export type UploadResponse = Upload;
