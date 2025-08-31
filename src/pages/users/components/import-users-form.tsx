import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	IconAlertTriangle,
	IconCheck,
	IconFileSpreadsheet,
	IconUpload,
	IconX,
} from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UsersAPI } from '@/apis/users';
import { toast } from 'sonner';
import { useState } from 'react';
import { useUploadExcel } from '@/hooks/users/useUploadExcel';

interface ImportUsersFormProps {
	onSubmit: (data: any[]) => void;
	onCancel: () => void;
	isLoading: boolean;
}

const ImportUsersForm: React.FC<ImportUsersFormProps> = ({
	onSubmit,
	onCancel,
	isLoading,
}) => {
	const [file, setFile] = useState<File | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>('');

	// Sử dụng hook upload Excel
	const { uploadExcel, isUploading, uploadResult, resetUpload } =
		useUploadExcel();

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (!selectedFile) return;

		// Kiểm tra định dạng file
		const allowedTypes = [
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
			'application/vnd.ms-excel', // .xls
		];

		if (!allowedTypes.includes(selectedFile.type)) {
			alert('Chỉ chấp nhận file Excel (.xlsx, .xls)');
			return;
		}

		setFile(selectedFile);
		resetUpload(); // Reset kết quả upload cũ
	};

	const handleUploadFile = async () => {
		if (!file) return;

		try {
			const result = await uploadExcel(file);
			if (result) {
				console.log('Upload result:', result);
			}
		} catch (error) {
			console.error('Upload error:', error);
		}
	};

	const handleSubmit = async () => {
		if (!uploadResult || uploadResult.validRows === 0) {
			alert('Không có dữ liệu hợp lệ để import');
			return;
		}

		try {
			// Gọi API để tạo users từ Excel data
			const result = await UsersAPI.createUsersFromExcel(uploadResult.data);

			if (result.successCount > 0) {
				toast.success(
					`Tạo thành công ${result.successCount}/${result.totalRows} users!`
				);

				// Gọi onSubmit để refresh danh sách
				onSubmit([]);
			} else {
				toast.error('Không thể tạo users nào từ dữ liệu Excel');
			}
		} catch (error: any) {
			console.error('Error creating users from Excel:', error);
			toast.error(
				error.response?.data?.message || 'Có lỗi xảy ra khi tạo users'
			);
		}
	};

	const handleRemoveFile = () => {
		setFile(null);
		resetUpload();
		setSearchTerm('');
	};

	// Filter data based on search term
	const filteredData =
		uploadResult?.data?.filter((row: any) => {
			if (!searchTerm) return true;

			const searchLower = searchTerm.toLowerCase();
			return (
				(row['Email'] &&
					row['Email'].toString().toLowerCase().includes(searchLower)) ||
				(row['Username'] &&
					row['Username'].toString().toLowerCase().includes(searchLower)) ||
				(row['Mã'] &&
					row['Mã'].toString().toLowerCase().includes(searchLower)) ||
				(row['Tên đăng nhập'] &&
					row['Tên đăng nhập'].toString().toLowerCase().includes(searchLower))
			);
		}) || [];

	return (
		<div className="flex flex-col h-full">
			{/* File Upload */}
			<Card className="mb-4">
				<CardHeader>
					<CardTitle className="text-base">Chọn file Excel</CardTitle>
				</CardHeader>
				<CardContent>
					{!file ? (
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
							<IconFileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
							<div className="mt-4">
								<Label htmlFor="file-upload" className="cursor-pointer">
									<Button variant="outline" asChild>
										<span>
											<IconUpload className="mr-2 h-4 w-4" />
											Chọn file Excel
										</span>
									</Button>
								</Label>
								<Input
									id="file-upload"
									type="file"
									accept=".xlsx,.xls"
									onChange={handleFileChange}
									className="hidden"
								/>
							</div>
							<p className="mt-2 text-sm text-gray-500">
								Hỗ trợ file .xlsx và .xls
							</p>
							<div className="mt-3 p-3 bg-blue-50 rounded-lg text-left">
								<p className="text-sm font-medium text-blue-800 mb-2">
									Format Excel yêu cầu:
								</p>
								<div className="text-xs text-blue-700 space-y-1">
									<p>
										<strong>Bắt buộc:</strong> Mã, Tên đăng nhập, Email, Mật
										khẩu, Vai trò, Trạng thái, Ngày sinh, Giới tính, Địa chỉ, Số
										điện thoại, Loại độc giả, Ngày bắt đầu, Ngày kết thúc
									</p>
									<p>
										<strong>Vai trò:</strong> học sinh, nhân viên, giáo viên
									</p>
									<p>
										<strong>Trạng thái:</strong> hoạt động, bị cấm
									</p>
									<p>
										<strong>Giới tính:</strong> male, female, other
									</p>
									<p>
										<strong>Loại độc giả:</strong> học sinh, giáo viên, nhân
										viên
									</p>
									<p>
										<strong>Định dạng ngày:</strong> dd/mm/yyyy
									</p>
									<p>
										<strong>Mật khẩu:</strong> Tối thiểu 6 ký tự, tối đa 255 ký
										tự
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div className="flex items-center space-x-3">
									<IconFileSpreadsheet className="h-8 w-8 text-green-500" />
									<div>
										<p className="font-medium">{file.name}</p>
										<p className="text-sm text-gray-500">
											{(file.size / 1024 / 1024).toFixed(2)} MB
										</p>
									</div>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleRemoveFile}
									className="text-red-500 hover:text-red-700"
								>
									<IconX className="h-4 w-4" />
								</Button>
							</div>

							{/* Upload Button */}
							{!uploadResult && (
								<Button
									onClick={handleUploadFile}
									disabled={isUploading}
									className="w-full"
								>
									{isUploading ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Đang upload...
										</>
									) : (
										<>
											<IconUpload className="mr-2 h-4 w-4" />
											Upload và kiểm tra file Excel
										</>
									)}
								</Button>
							)}

							{/* Upload Result Summary */}
							{uploadResult && (
								<div className="p-4 border rounded-lg bg-gray-50">
									<div className="flex items-center space-x-2 mb-3">
										<IconCheck className="h-5 w-5 text-green-500" />
										<span className="font-medium text-green-700">
											Kết quả kiểm tra file
										</span>
									</div>

									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<p>
												<strong>Tổng số dòng:</strong> {uploadResult.totalRows}
											</p>
											<p>
												<strong>Dòng hợp lệ:</strong>{' '}
												<span className="text-green-600">
													{uploadResult.validRows}
												</span>
											</p>
											<p>
												<strong>Dòng có lỗi:</strong>{' '}
												<span className="text-red-600">
													{uploadResult.invalidRows}
												</span>
											</p>
										</div>
										<div>
											<p>
												<strong>Tên file:</strong> {uploadResult.filename}
											</p>
											<p>
												<strong>Kích thước:</strong>{' '}
												{(uploadResult.size / 1024).toFixed(1)} KB
											</p>
										</div>
									</div>

									{/* Error Summary */}
									{uploadResult.errors && uploadResult.errors.length > 0 && (
										<div className="mt-3 p-3 bg-red-50 rounded-lg">
											<div className="flex items-center space-x-2 mb-2">
												<IconAlertTriangle className="h-4 w-4 text-red-500" />
												<span className="text-sm font-medium text-red-700">
													Lỗi cần sửa ({uploadResult.errors.length} lỗi):
												</span>
											</div>
											<div className="text-xs text-red-600 space-y-1 max-h-20 overflow-y-auto">
												{uploadResult.errors.map(
													(error: string, index: number) => (
														<p key={index}>• {error}</p>
													)
												)}
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Data Preview with Search - Takes remaining space */}
			{uploadResult && uploadResult.data.length > 0 && (
				<Card className="flex-1 flex flex-col min-h-0">
					<CardHeader className="flex-shrink-0">
						<CardTitle className="text-base">
							Dữ liệu Excel ({uploadResult.data.length} dòng)
						</CardTitle>
						<div className="mt-2">
							<Input
								placeholder="Tìm kiếm theo email, username, mã người dùng..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="max-w-md"
							/>
						</div>
					</CardHeader>
					<CardContent>
						<div className="h-[400px] border rounded-lg overflow-auto">
							<div className="min-w-[800px]">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b bg-gray-50">
											{Object.keys(uploadResult.data[0])
												.filter((key) => key !== '_rowIndex')
												.map((header) => (
													<th
														key={header}
														className="text-left p-3 font-medium text-gray-700 whitespace-nowrap"
													>
														{header}
													</th>
												))}
										</tr>
									</thead>
									<tbody>
										{filteredData.map((row: any, index: number) => (
											<tr key={index} className="border-b hover:bg-gray-50">
												{Object.entries(row)
													.filter(([key]) => key !== '_rowIndex')
													.map(([key, value]) => (
														<td key={key} className="p-3 whitespace-nowrap">
															{String(value || '')}
														</td>
													))}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						{searchTerm && (
							<p className="text-sm text-gray-500 mt-2">
								Hiển thị {filteredData.length} trong tổng số{' '}
								{uploadResult.data.length} dòng
							</p>
						)}
					</CardContent>
				</Card>
			)}

			{/* Action Buttons - Fixed at bottom */}
			<div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
				<Button variant="outline" onClick={onCancel} disabled={isLoading}>
					Hủy
				</Button>
				<Button
					onClick={handleSubmit}
					disabled={isLoading || !uploadResult || uploadResult.validRows === 0}
				>
					{isLoading
						? 'Đang import...'
						: `Import ${uploadResult?.validRows || 0} người dùng`}
				</Button>
			</div>
		</div>
	);
};

export default ImportUsersForm;
