# 📤 Upload File Integration - Tích hợp Upload vào Create EBook Dialog

## 🎯 Mục tiêu

Cập nhật component `CreateEBookDialog` để sử dụng file upload thay vì input text, tích hợp với API upload file `/api/uploads/upload`.

## ✅ Thay đổi đã thực hiện

### **1. Cập nhật CreateEBookDialog** 📝

**File**: `src/pages/books/ebook/[id]/components/create-ebook-dialog.tsx`

**Thay đổi chính**:

- Thay thế input text bằng file input
- Thêm logic upload file với API
- Hiển thị thông tin file đã chọn và đã upload
- Auto-detect định dạng file từ extension

### **2. Tạo Upload Types** 📋

**File**: `src/types/uploads.ts`

**Types mới**:

```typescript
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
```

### **3. Cập nhật API Exports** 🔗

**Files**:

- `src/types/index.ts` - Export upload types
- `src/apis/index.ts` - Export UploadsAPI

## 🔄 Workflow mới

### **Trước:**

```typescript
// Input text cho file path và size
<input type="text" placeholder="/path/to/file.pdf" />
<input type="number" placeholder="1024000" />
```

### **Sau:**

```typescript
// File upload workflow
1. Chọn file → handleFileSelect()
2. Hiển thị thông tin file đã chọn
3. Upload file → handleUpload() → API /api/uploads/upload
4. Nhận response và cập nhật form data
5. Hiển thị thông tin file đã upload thành công
```

## 🎨 UI/UX Improvements

### **1. File Selection**

- File input với accept types: `.pdf,.epub,.mobi,.azw,.txt,.docx`
- Nút X để xóa file đã chọn
- Auto-detect định dạng từ file extension

### **2. File Preview**

```typescript
// Selected File Info
{
	selectedFile && (
		<div className="p-3 border rounded-lg bg-gray-50">
			<div className="flex items-center space-x-2">
				<FileText className="h-4 w-4 text-blue-500" />
				<span className="font-medium">{selectedFile.name}</span>
			</div>
			<p className="text-sm text-gray-600 mt-1">
				Kích thước: {formatFileSize(selectedFile.size)}
			</p>
			<Button onClick={handleUpload}>
				<UploadIcon className="mr-2 h-4 w-4" />
				Upload File
			</Button>
		</div>
	);
}
```

### **3. Upload Success**

```typescript
// Uploaded File Info
{
	uploadedFile && (
		<div className="p-3 border rounded-lg bg-green-50 border-green-200">
			<div className="flex items-center space-x-2">
				<FileText className="h-4 w-4 text-green-500" />
				<span className="font-medium text-green-700">
					✓ File đã upload thành công
				</span>
			</div>
			<div className="text-sm text-green-600 mt-1 space-y-1">
				<p>Tên file: {uploadedFile.originalName}</p>
				<p>Đường dẫn: {uploadedFile.filePath}</p>
				<p>Kích thước: {formatFileSize(uploadedFile.fileSize)}</p>
				<p>Định dạng: {uploadedFile.mimeType}</p>
			</div>
		</div>
	);
}
```

## 🔧 API Integration

### **Upload Process:**

```typescript
const handleUpload = async () => {
	if (!selectedFile) {
		toast.error('Vui lòng chọn file để upload');
		return;
	}

	setIsUploading(true);
	try {
		const formData = new FormData();
		formData.append('file', selectedFile);

		const uploadResult = await UploadsAPI.upload(formData);
		setUploadedFile(uploadResult);

		// Update form data with uploaded file info
		setFormData((prev) => ({
			...prev,
			file_path: uploadResult.filePath,
			file_size: uploadResult.fileSize,
		}));

		toast.success('Upload file thành công!');
	} catch (error: any) {
		toast.error(error.message || 'Có lỗi xảy ra khi upload file');
	} finally {
		setIsUploading(false);
	}
};
```

### **API Response Handling:**

```typescript
// Expected API Response
{
  "id": "2c327928-8ebd-466d-8b9c-6d99605df7f6",
  "originalName": "05-TTr-TPUN.pdf",
  "fileName": "05-ttr-tpun.pdf",
  "slug": "05-ttr-tpun",
  "filePath": "files/05-ttr-tpun.pdf",
  "fileSize": 4406148,
  "mimeType": "application/pdf",
  "createdAt": "2025-08-02T19:55:51.111Z",
  "updatedAt": "2025-08-02T19:55:51.111Z"
}
```

## 🎯 Features mới

### **1. Smart Format Detection**

```typescript
const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
	const file = event.target.files?.[0];
	if (file) {
		setSelectedFile(file);
		// Auto-detect format from file extension
		const extension = file.name.split('.').pop()?.toUpperCase();
		if (extension) {
			setFormData((prev) => ({
				...prev,
				file_format:
					extension === 'PDF'
						? 'PDF'
						: extension === 'EPUB'
						? 'EPUB'
						: extension === 'MOBI'
						? 'MOBI'
						: extension === 'AZW'
						? 'AZW'
						: extension === 'TXT'
						? 'TXT'
						: extension === 'DOCX'
						? 'DOCX'
						: 'PDF',
			}));
		}
	}
};
```

### **2. File Size Formatting**

```typescript
const formatFileSize = (bytes: number) => {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
```

### **3. Validation & Error Handling**

- Kiểm tra file đã được chọn trước khi upload
- Kiểm tra file đã upload trước khi tạo ebook
- Loading states cho upload và create
- Toast notifications cho success/error

### **4. State Management**

```typescript
const [uploadedFile, setUploadedFile] = useState<Upload | null>(null);
const [isUploading, setIsUploading] = useState(false);
const [selectedFile, setSelectedFile] = useState<File | null>(null);
```

## 📊 So sánh

| Aspect              | Trước            | Sau                  |
| ------------------- | ---------------- | -------------------- |
| **File Input**      | Text input       | File upload          |
| **File Path**       | Manual entry     | Auto from upload     |
| **File Size**       | Manual entry     | Auto from upload     |
| **Format**          | Manual selection | Auto-detect + manual |
| **Validation**      | Basic            | File type + size     |
| **User Experience** | Manual process   | Streamlined workflow |
| **Error Handling**  | Basic            | Comprehensive        |

## 🎯 Lợi ích

### **1. User Experience**

- Quy trình upload đơn giản hơn
- Auto-detect định dạng file
- Visual feedback cho upload status
- Không cần nhập thủ công file path/size

### **2. Data Accuracy**

- File path và size chính xác từ server
- Không có lỗi nhập liệu thủ công
- Đảm bảo file tồn tại trước khi tạo ebook

### **3. Security**

- File được validate trên server
- Chỉ cho phép các định dạng được hỗ trợ
- File được lưu trữ an toàn

### **4. Maintainability**

- Logic upload tách biệt
- Dễ dàng thêm validation rules
- Có thể tái sử dụng cho các module khác

## 🚀 Sử dụng

### **Import:**

```typescript
import { UploadsAPI } from '@/apis/uploads';
import type { Upload } from '@/types';
```

### **Upload File:**

```typescript
const formData = new FormData();
formData.append('file', selectedFile);
const uploadResult = await UploadsAPI.upload(formData);
```

### **Create EBook:**

```typescript
onSubmit({
	book_id: bookId,
	file_path: uploadResult.filePath,
	file_size: uploadResult.fileSize,
	file_format: formData.file_format,
});
```

## ✅ Kết luận

Việc tích hợp upload file đã thành công:

- **Cải thiện UX** với file upload thay vì input text
- **Tích hợp API** upload file hoàn chỉnh
- **Auto-detect** định dạng file
- **Validation** và error handling tốt hơn
- **Visual feedback** cho user

Quy trình tạo ebook giờ đây trở nên đơn giản và chính xác hơn! 🎉

---

**Last Updated**: 2024-01-01
**Status**: ✅ Completed
**API Integration**: ✅ UploadsAPI
**File Types**: ✅ PDF, EPUB, MOBI, AZW, TXT, DOCX
