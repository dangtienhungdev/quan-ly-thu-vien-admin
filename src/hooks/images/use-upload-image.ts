import { ImagesAPI, type Image } from '@/apis/images';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseUploadImageOptions {
	onSuccess?: (image: Image) => void;
	onError?: (error: Error) => void;
}

export const useUploadImage = (options: UseUploadImageOptions = {}) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (file: File) => {
			console.log('🚀 Uploading image:', file.name, file.size, file.type);

			// Validate file type
			if (!file.type.startsWith('image/')) {
				throw new Error('Chỉ cho phép upload file ảnh');
			}

			// Validate file size (10MB max)
			if (file.size > 10 * 1024 * 1024) {
				throw new Error('File ảnh không được quá 10MB');
			}

			const formData = new FormData();
			formData.append('file', file);

			console.log('📤 Calling ImagesAPI.upload...');
			const result = await ImagesAPI.upload(formData);
			console.log('✅ Upload successful:', result);

			return result;
		},
		onSuccess: (image: Image) => {
			console.log('🎉 Upload success callback:', image);
			queryClient.invalidateQueries({ queryKey: ['images'] });
			toast.success('Upload ảnh thành công!');
			onSuccess?.(image);
		},
		onError: (error: Error) => {
			console.error('❌ Upload error:', error);
			const errorMessage = error.message || 'Có lỗi xảy ra khi upload ảnh';
			toast.error(errorMessage);
			onError?.(error);
		},
	});

	return {
		uploadImage: mutation.mutate,
		uploadImageAsync: mutation.mutateAsync,
		isUploading: mutation.isPending,
		error: mutation.error,
	};
};
