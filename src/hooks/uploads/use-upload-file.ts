import { UploadsAPI } from '@/apis/uploads';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseUploadFileOptions {
	onSuccess?: (upload: any) => void;
	onError?: (error: Error) => void;
}

export const useUploadFile = (options: UseUploadFileOptions = {}) => {
	const { onSuccess, onError } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (file: File) => {
			const formData = new FormData();
			formData.append('file', file);
			return UploadsAPI.upload(formData);
		},
		onSuccess: (upload) => {
			queryClient.invalidateQueries({ queryKey: ['uploads'] });
			toast.success('Upload file thành công!');
			onSuccess?.(upload);
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Có lỗi xảy ra khi upload file');
			onError?.(error);
		},
	});

	return {
		uploadFile: mutation.mutate,
		uploadFileAsync: mutation.mutateAsync,
		isUploading: mutation.isPending,
		error: mutation.error,
	};
};
