import { UsersAPI, type UploadExcelResponse } from '@/apis/users';
import { useState } from 'react';
import { toast } from 'sonner';

interface UseUploadExcelReturn {
	uploadExcel: (file: File) => Promise<UploadExcelResponse | null>;
	isUploading: boolean;
	uploadResult: UploadExcelResponse | null;
	resetUpload: () => void;
}

export const useUploadExcel = (): UseUploadExcelReturn => {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadResult, setUploadResult] = useState<UploadExcelResponse | null>(
		null
	);

	const uploadExcel = async (
		file: File
	): Promise<UploadExcelResponse | null> => {
		try {
			setIsUploading(true);

			// Validate file type
			const allowedTypes = [
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
				'application/vnd.ms-excel', // .xls
			];

			if (!allowedTypes.includes(file.type)) {
				toast.error('Chỉ chấp nhận file Excel (.xlsx, .xls)');
				return null;
			}

			// Validate file size (max 10MB)
			const maxSize = 10 * 1024 * 1024; // 10MB
			if (file.size > maxSize) {
				toast.error('File quá lớn. Kích thước tối đa: 10MB');
				return null;
			}

			const result = await UsersAPI.uploadExcel(file);
			setUploadResult(result);

			// Hiển thị thông báo kết quả
			if (result.validRows > 0) {
				toast.success(
					`Upload thành công! ${result.validRows}/${result.totalRows} dòng hợp lệ`
				);

				if (result.invalidRows > 0) {
					toast.warning(
						`${result.invalidRows} dòng có lỗi. Vui lòng kiểm tra và sửa lại.`
					);
				}
			} else {
				toast.error('Không có dòng dữ liệu hợp lệ nào trong file Excel');
			}

			return result;
		} catch (error: any) {
			console.error('Upload Excel error:', error);

			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				'Có lỗi xảy ra khi upload file Excel';

			toast.error(errorMessage);
			return null;
		} finally {
			setIsUploading(false);
		}
	};

	const resetUpload = () => {
		setUploadResult(null);
	};

	return {
		uploadExcel,
		isUploading,
		uploadResult,
		resetUpload,
	};
};
