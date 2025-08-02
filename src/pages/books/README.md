# 📚 Quản lý Sách - Books Management

## 🎯 Tổng quan

Module Quản lý Sách cung cấp đầy đủ các tính năng để quản lý sách trong hệ thống thư viện, bao gồm:

- ✅ **CRUD Operations**: Tạo, đọc, cập nhật, xóa sách
- ✅ **Image Upload**: Upload ảnh bìa sách lên Cloudinary
- ✅ **Author Management**: Quản lý tác giả cho sách
- ✅ **Search & Filter**: Tìm kiếm và lọc sách
- ✅ **Pagination**: Phân trang danh sách sách
- ✅ **Responsive Design**: Giao diện responsive

## 🚀 Tính năng chính

### 1. **Quản lý Sách**

#### **Tạo sách mới**

- Form đầy đủ với validation
- Upload ảnh bìa từ máy tính
- Chọn nhiều tác giả
- Hỗ trợ cả sách vật lý và ebook

#### **Chỉnh sửa sách**

- Cập nhật thông tin sách
- Thay đổi ảnh bìa
- Quản lý tác giả

#### **Xóa sách**

- Xác nhận trước khi xóa
- Hiển thị thông tin sách sẽ xóa

### 2. **Upload Ảnh Bìa**

#### **Tính năng upload**

- Upload file từ máy tính
- Preview ảnh trước khi upload
- Tự động upload lên Cloudinary
- Fallback icon khi không có ảnh

#### **Hỗ trợ format**

- JPEG, PNG, GIF, WebP
- Tối đa 10MB
- Tự động optimize

### 3. **Quản lý Tác giả**

#### **Chọn tác giả**

- Dropdown chọn tác giả
- Hiển thị danh sách tác giả đã chọn
- Xóa tác giả khỏi sách

#### **Hiển thị trong bảng**

- Danh sách tác giả của từng sách
- Fallback khi không có tác giả

### 4. **Tìm kiếm và Lọc**

#### **Tìm kiếm**

- Tìm theo tên sách
- Tìm theo ISBN
- Tìm theo mô tả

#### **Hiển thị kết quả**

- Phân trang kết quả tìm kiếm
- Thống kê số lượng kết quả

## 📋 Cấu trúc API

### **Books API**

```typescript
// Tạo sách mới
POST /api/books
{
  "title": "Tên sách",
  "isbn": "9786041085259",
  "publish_year": 2024,
  "edition": "1st",
  "description": "Mô tả sách",
  "cover_image": "https://cloudinary.com/...",
  "language": "Tiếng Việt",
  "page_count": 300,
  "book_type": "physical",
  "physical_type": "borrowable",
  "publisher_id": "uuid",
  "category_id": "uuid",
  "author_ids": ["uuid1", "uuid2"]
}
```

### **Images API**

```typescript
// Upload ảnh
POST /api/images/upload
Content-Type: multipart/form-data
file: [Image file]

// Response
{
  "id": "uuid",
  "cloudinaryUrl": "https://res.cloudinary.com/...",
  "cloudinaryPublicId": "folder/image-name",
  // ... other fields
}
```

### **Uploads API**

```typescript
// Upload file PDF
POST /api/uploads/upload
Content-Type: multipart/form-data
file: [PDF file]

// Response
{
  "id": "uuid",
  "filePath": "files/document.pdf",
  "fileSize": 1048576,
  // ... other fields
}
```

## 🎨 Components

### **BookCover Component**

```typescript
import BookCover from '@/components/book-cover';

<BookCover
	src="https://example.com/cover.jpg"
	alt="Book title"
	size="md" // sm | md | lg
/>;
```

### **CreateBookForm Component**

```typescript
import CreateBookForm from './components/create-book-form';

<CreateBookForm
	onSubmit={handleCreateBook}
	onCancel={handleCancel}
	isLoading={false}
	categories={categories}
	publishers={publishers}
	authors={authors}
/>;
```

### **EditBookForm Component**

```typescript
import EditBookForm from './components/edit-book-form';

<EditBookForm
	book={bookData}
	onSubmit={handleUpdateBook}
	onCancel={handleCancel}
	isLoading={false}
	categories={categories}
	publishers={publishers}
	authors={authors}
/>;
```

## 🔧 Hooks

### **useUploadImage**

```typescript
import { useUploadImage } from '@/hooks/images';

const { uploadImage, isUploading } = useUploadImage({
	onSuccess: (image) => {
		console.log('Upload success:', image.cloudinaryUrl);
	},
	onError: (error) => {
		console.error('Upload failed:', error);
	},
});

// Upload file
uploadImage(file);
```

### **useUploadFile**

```typescript
import { useUploadFile } from '@/hooks/uploads';

const { uploadFile, isUploading } = useUploadFile({
	onSuccess: (upload) => {
		console.log('Upload success:', upload.filePath);
	},
});

// Upload file
uploadFile(file);
```

## 📊 Database Schema

### **Books Table**

```sql
CREATE TABLE books (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) UNIQUE NOT NULL,
  publish_year INTEGER NOT NULL,
  edition VARCHAR(50) NOT NULL,
  description TEXT,
  cover_image VARCHAR(500),
  language VARCHAR(50) NOT NULL,
  page_count INTEGER NOT NULL,
  book_type ENUM('physical', 'ebook') NOT NULL,
  physical_type ENUM('library_use', 'borrowable'),
  publisher_id UUID REFERENCES publishers(id),
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **BookAuthors Table**

```sql
CREATE TABLE book_authors (
  id UUID PRIMARY KEY,
  book_id UUID REFERENCES books(id),
  author_id UUID REFERENCES authors(id),
  UNIQUE(book_id, author_id)
);
```

## 🚀 Sử dụng

### **1. Tạo sách mới**

1. Click "Thêm sách"
2. Điền thông tin sách
3. Upload ảnh bìa (tùy chọn)
4. Chọn tác giả
5. Click "Tạo sách"

### **2. Chỉnh sửa sách**

1. Click icon edit trên sách
2. Cập nhật thông tin
3. Thay đổi ảnh bìa nếu cần
4. Quản lý tác giả
5. Click "Cập nhật sách"

### **3. Upload ảnh bìa**

1. Chọn file ảnh từ máy tính
2. Preview ảnh
3. Click "Upload"
4. Ảnh sẽ được upload lên Cloudinary
5. URL ảnh tự động điền vào form

### **4. Tìm kiếm sách**

1. Nhập từ khóa vào ô tìm kiếm
2. Press Enter hoặc click "Tìm kiếm"
3. Xem kết quả
4. Click "Xóa tìm kiếm" để reset

## 🔒 Validation Rules

### **Book Validation**

- **title**: Bắt buộc, tối đa 255 ký tự
- **isbn**: Bắt buộc, tối đa 20 ký tự, unique
- **publish_year**: Bắt buộc, từ 1900 đến năm hiện tại + 1
- **edition**: Bắt buộc, tối đa 50 ký tự
- **language**: Bắt buộc, tối đa 50 ký tự
- **page_count**: Bắt buộc, từ 1 đến 10000
- **publisher_id**: Bắt buộc, UUID hợp lệ
- **category_id**: Bắt buộc, UUID hợp lệ
- **author_ids**: Tùy chọn, mảng UUID

### **Image Validation**

- **File type**: JPEG, PNG, GIF, WebP
- **File size**: Tối đa 10MB
- **Required**: Không bắt buộc

## 🎯 Roadmap

### **Phase 1 - Core Features** ✅

- [x] CRUD operations cho sách
- [x] Upload ảnh bìa
- [x] Quản lý tác giả
- [x] Tìm kiếm và phân trang

### **Phase 2 - Advanced Features** 📋

- [ ] Bulk operations (tạo nhiều sách)
- [ ] Import/Export sách
- [ ] Advanced filters
- [ ] Book recommendations

### **Phase 3 - Enterprise Features** 📋

- [ ] Book analytics
- [ ] Integration với external APIs
- [ ] Advanced reporting
- [ ] Mobile app support

## 📞 Hỗ trợ

**Module Version**: 2.0
**Last Updated**: 2024-01-01
**Dependencies**:

- React Query
- React Hook Form
- Zod validation
- Cloudinary
- Tailwind CSS

**Performance Targets**:

- Page Load: < 2s
- Search Response: < 500ms
- Image Upload: < 3s
- Concurrent Users: 100+
