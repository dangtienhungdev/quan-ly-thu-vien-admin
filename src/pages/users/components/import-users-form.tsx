import * as XLSX from 'xlsx';

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
	const [previewData, setPreviewData] = useState<any[]>([]);
	const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);

	// Sử dụng hook upload Excel
	const { uploadExcel, isUploading, uploadResult, resetUpload } =
		useUploadExcel();

	// Hàm đọc file Excel và preview
	const readExcelFile = (file: File) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: 'array' });

				// Lấy sheet đầu tiên
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];

				// Chuyển đổi thành JSON
				const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

				if (jsonData.length < 2) {
					toast.error(
						'File Excel phải có ít nhất 1 dòng header và 1 dòng dữ liệu'
					);
					return;
				}

				// Lấy header (dòng đầu tiên)
				const headers = jsonData[0] as string[];

				// Chuyển đổi dữ liệu thành object
				const processedData = jsonData
					.slice(1)
					.map((row: any, index: number) => {
						const rowData: any = {};
						headers.forEach((header, colIndex) => {
							if (header && row[colIndex] !== undefined) {
								let value = row[colIndex];

								// Format ngày tháng nếu là các trường ngày
								const dateFields = ['dob', 'cardIssueDate', 'cardExpriryDate'];
								if (dateFields.includes(header.trim().toLowerCase())) {
									value = formatExcelDate(value);
								}

								rowData[header.trim()] = value;
							}
						});
						return {
							...rowData,
							_rowIndex: index + 2, // +2 vì index bắt đầu từ 0 và có header
						};
					})
					.filter((row) => {
						// Lọc bỏ các dòng trống
						return Object.values(row).some(
							(value) => value !== undefined && value !== null && value !== ''
						);
					});

				setPreviewHeaders(headers);
				setPreviewData(processedData);
			} catch (error) {
				console.error('Error reading Excel file:', error);
				toast.error('Không thể đọc file Excel');
			}
		};
		reader.readAsArrayBuffer(file);
	};

	// Hàm format ngày tháng từ Excel
	const formatExcelDate = (value: any): string => {
		if (!value) return '';

		try {
			let date: Date;

			// Nếu là số (Excel serial number)
			if (typeof value === 'number') {
				// Excel serial number - chuyển đổi sang Date
				date = new Date((value - 25569) * 86400 * 1000);
			} else if (value instanceof Date) {
				// Date object
				date = value;
			} else if (typeof value === 'string') {
				// String - thử parse
				date = new Date(value);
			} else {
				return String(value);
			}

			// Kiểm tra date hợp lệ
			if (isNaN(date.getTime())) {
				return String(value);
			}

			// Format thành dd/mm/yyyy
			const day = date.getDate().toString().padStart(2, '0');
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const year = date.getFullYear();

			return `${day}/${month}/${year}`;
		} catch (error) {
			console.error('Error formatting date:', error);
			return String(value);
		}
	};

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

		// Đọc và preview file ngay lập tức
		readExcelFile(selectedFile);

		// Thông báo preview thành công
		toast.success(
			'Đã đọc file Excel thành công! Bạn có thể xem preview bên dưới.'
		);
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
		setPreviewData([]);
		setPreviewHeaders([]);
	};

	// Filter data based on search term (sử dụng previewData hoặc uploadResult.data)
	const dataToShow = uploadResult?.data || previewData;
	const filteredData = dataToShow.filter((row: any) => {
		if (!searchTerm) return true;

		const searchLower = searchTerm.toLowerCase();
		return (
			(row['email'] &&
				row['email'].toString().toLowerCase().includes(searchLower)) ||
			(row['username'] &&
				row['username'].toString().toLowerCase().includes(searchLower)) ||
			(row['useCode'] &&
				row['useCode'].toString().toLowerCase().includes(searchLower))
		);
	});

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
										<strong>Bắt buộc:</strong> useCode, username, email,
										password, role, accountStatus, gender, address, phone,
										readerType
									</p>
									<p>
										<strong>Vai trò:</strong> Độc giả, Admin
									</p>
									<p>
										<strong>Trạng thái:</strong> Hoạt động, Không hoạt động
									</p>
									<p>
										<strong>Giới tính:</strong> Nam, Nữ, Khác
									</p>
									<p>
										<strong>Loại độc giả:</strong> student, teacher, staff
									</p>
									<p>
										<strong>Định dạng ngày:</strong> YYYY-MM-DD
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
			{dataToShow.length > 0 && (
				<Card className="flex-1 flex flex-col min-h-0">
					<CardHeader className="flex-shrink-0">
						<CardTitle className="text-base">
							{uploadResult
								? 'Dữ liệu Excel đã validate'
								: 'Preview dữ liệu Excel'}{' '}
							({dataToShow.length} dòng)
						</CardTitle>
						{!uploadResult && (
							<div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
								<div className="flex items-center space-x-2">
									<IconAlertTriangle className="h-4 w-4 text-yellow-600" />
									<span className="text-sm text-yellow-800">
										Đây là preview dữ liệu. Vui lòng click "Upload và kiểm tra
										file Excel" để validate dữ liệu trước khi import.
									</span>
								</div>
							</div>
						)}
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
											{previewHeaders.length > 0
												? previewHeaders
														.filter((header) => header !== '_rowIndex')
														.map((header) => (
															<th
																key={header}
																className="text-left p-3 font-medium text-gray-700 whitespace-nowrap"
															>
																{header}
															</th>
														))
												: Object.keys(dataToShow[0])
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
													.map(([key, value]) => {
														// Format ngày tháng cho các trường ngày
														let displayValue = value;
														const dateFields = [
															'dob',
															'cardIssueDate',
															'cardExpriryDate',
														];
														if (
															dateFields.includes(key.toLowerCase()) &&
															value
														) {
															displayValue = formatExcelDate(value);
														}

														return (
															<td key={key} className="p-3 whitespace-nowrap">
																{String(displayValue || '')}
															</td>
														);
													})}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						{searchTerm && (
							<p className="text-sm text-gray-500 mt-2">
								Hiển thị {filteredData.length} trong tổng số {dataToShow.length}{' '}
								dòng
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
					disabled={
						isLoading || !uploadResult || uploadResult.validRows === 0 || !file
					}
				>
					{isLoading
						? 'Đang import...'
						: uploadResult && uploadResult.validRows > 0
						? `Import ${uploadResult.validRows} người dùng`
						: 'Import người dùng'}
				</Button>
			</div>
		</div>
	);
};

export default ImportUsersForm;
