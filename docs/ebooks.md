# 📚 Module EBooks - Quản lý Sách Điện tử

## 📋 Tổng quan

Module EBooks quản lý các sách điện tử trong thư viện, bao gồm việc theo dõi file, định dạng, kích thước, lượt tải và quản lý vòng đời của từng ebook.

## 🔐 Xác thực và Phân quyền

### **Vai trò được phép:**
- **Reader**: Xem danh sách ebook, tìm kiếm, tăng lượt tải
- **Admin**: Tất cả quyền (tạo, cập nhật, xóa, quản lý file)

### **Endpoints yêu cầu quyền Admin:**
- `POST /ebooks` - Tạo ebook mới
- `POST /ebooks/book/:bookId/many` - Tạo nhiều ebook
- `PATCH /ebooks/:id` - Cập nhật ebook
- `PATCH /ebooks/:id/file-info` - Cập nhật thông tin file
- `DELETE /ebooks/:id` - Xóa ebook
- `DELETE /ebooks/batch` - Xóa nhiều ebook

## 🚀 API Endpoints

### **1. Tạo ebook mới**
```http
POST /ebooks
```

**Request Body:**
```json
{
  "book_id": "550e8400-e29b-41d4-a716-446655440000",
  "file_path": "/storage/ebooks/sample.pdf",
  "file_size": 1024000,
  "file_format": "PDF"
}
```

### **2. Tạo nhiều ebook cùng lúc**
```http
POST /ebooks/book/550e8400-e29b-41d4-a716-446655440000/many
```

**Request Body:**
```json
{
  "ebooks": [
    {
      "file_path": "/storage/ebooks/sample.pdf",
      "file_size": 1024000,
      "file_format": "PDF"
    },
    {
      "file_path": "/storage/ebooks/sample.epub",
      "file_size": 512000,
      "file_format": "EPUB"
    }
  ]
}
```

### **3. Lấy danh sách tất cả ebook**
```http
GET /ebooks?page=1&limit=10
```

### **4. Tìm kiếm ebook**
```http
GET /ebooks/search?q=PDF&page=1&limit=10
```

### **5. Lọc theo định dạng file**
```http
GET /ebooks/format/PDF?page=1&limit=10
```

### **6. Lọc theo kích thước file**
```http
GET /ebooks/size-range?minSize=100000&maxSize=5000000&page=1&limit=10
```

### **7. Ebook phổ biến**
```http
GET /ebooks/popular?limit=10
```

### **8. Ebook mới nhất**
```http
GET /ebooks/recent?limit=10
```

### **9. Lọc theo lượt tải**
```http
GET /ebooks/downloads/100?page=1&limit=10
```

### **10. Lọc theo tác giả**
```http
GET /ebooks/author/550e8400-e29b-41d4-a716-446655440000?page=1&limit=10
```

### **11. Lọc theo thể loại**
```http
GET /ebooks/category/550e8400-e29b-41d4-a716-446655440000?page=1&limit=10
```

### **12. Thống kê ebook**
```http
GET /ebooks/stats
```

**Response (200):**
```json
{
  "total": 150,
  "totalDownloads": 5000,
  "totalSize": 1073741824,
  "byFormat": [
    { "format": "PDF", "count": 80, "totalSize": 536870912 },
    { "format": "EPUB", "count": 50, "totalSize": 268435456 },
    { "format": "MOBI", "count": 20, "totalSize": 268435456 }
  ],
  "popularEbooks": [
    { "id": "ebook-uuid", "title": "Sách phổ biến", "downloads": 500 },
    { "id": "ebook-uuid-2", "title": "Sách hay", "downloads": 300 }
  ],
  "recentUploads": [
    { "id": "ebook-uuid", "title": "Sách mới", "uploadDate": "2024-01-01T00:00:00.000Z" }
  ]
}
```

### **13. Lấy ebook theo sách**
```http
GET /ebooks/book/550e8400-e29b-41d4-a716-446655440000?page=1&limit=10
```

### **14. Lấy chi tiết ebook**
```http
GET /ebooks/550e8400-e29b-41d4-a716-446655440000
```

### **15. Cập nhật ebook**
```http
PATCH /ebooks/550e8400-e29b-41d4-a716-446655440000
```

### **16. Cập nhật thông tin file (Admin)**
```http
PATCH /ebooks/550e8400-e29b-41d4-a716-446655440000/file-info
```

**Request Body:**
```json
{
  "file_path": "/storage/ebooks/updated.pdf",
  "file_size": 2048000,
  "file_format": "PDF"
}
```

### **17. Tăng lượt tải**
```http
POST /ebooks/550e8400-e29b-41d4-a716-446655440000/increment-downloads
```

### **18. Xóa ebook (Admin)**
```http
DELETE /ebooks/550e8400-e29b-41d4-a716-446655440000
```

### **19. Xóa nhiều ebook (Admin)**
```http
DELETE /ebooks/batch
```

**Request Body:**
```json
{
  "ids": [
    "550e8400-e29b-41d4-a716-446655440000",
    "550e8400-e29b-41d4-a716-446655440001"
  ]
}
```

## 📊 Định dạng File và Kích thước

### **Định dạng được hỗ trợ:**
- `PDF`: Portable Document Format
- `EPUB`: Electronic Publication
- `MOBI`: Mobipocket eBook
- `AZW`: Amazon Kindle Format
- `TXT`: Plain Text
- `DOCX`: Microsoft Word Document

### **Kích thước file:**
- Đơn vị: bytes
- Hỗ trợ file từ 1KB đến 100MB
- Tự động tính tổng dung lượng lưu trữ

## ✅ Quy tắc Nghiệp vụ

### **1. Tạo ebook:**
- ✅ Chỉ có thể tạo ebook cho sách có book_type = 'ebook'
- ✅ File path phải unique
- ✅ Tự động validate định dạng file
- ✅ Tracking kích thước file

### **2. Quản lý file:**
- ✅ Cập nhật thông tin file (path, size, format)
- ✅ Validate file tồn tại trước khi tạo
- ✅ Tracking thay đổi file

### **3. Quản lý lượt tải:**
- ✅ Tự động tăng lượt tải khi download
- ✅ Tracking popular ebooks
- ✅ Thống kê theo thời gian

### **4. Tìm kiếm và lọc:**
- ✅ Tìm kiếm theo tên sách, ISBN, định dạng
- ✅ Lọc theo định dạng, kích thước, lượt tải
- ✅ Lọc theo tác giả, thể loại
- ✅ Phân trang cho tất cả danh sách

## 🔍 Tính năng Tìm kiếm

### **Tìm kiếm theo:**
- Tên sách (title)
- ISBN của sách
- Định dạng file (PDF, EPUB, etc.)

### **Lọc theo:**
- Định dạng file
- Kích thước file (range)
- Số lượt tải
- Tác giả
- Thể loại
- Sách cụ thể

## 📈 Thống kê và Báo cáo

### **Thống kê tổng quan:**
- Tổng số ebook
- Tổng số lượt tải
- Tổng kích thước lưu trữ

### **Thống kê theo định dạng:**
- Số lượng từng định dạng
- Tổng kích thước từng định dạng
- Phân bố định dạng

### **Ebook phổ biến:**
- Top 10 ebook nhiều lượt tải
- Ebook mới nhất
- Xu hướng tải xuống

## ⚡ Tối ưu Hiệu suất

### **Database Indexes:**
```sql
-- Indexes cho performance
CREATE INDEX idx_ebooks_book_id ON ebooks(book_id);
CREATE INDEX idx_ebooks_file_format ON ebooks(file_format);
CREATE INDEX idx_ebooks_file_size ON ebooks(file_size);
CREATE INDEX idx_ebooks_download_count ON ebooks(download_count);
CREATE INDEX idx_ebooks_created_at ON ebooks(created_at);
```

### **Query Optimization:**
- Sử dụng pagination cho tất cả danh sách
- Eager loading cho relations (book)
- Efficient filtering và sorting
- Caching cho popular ebooks

## 🔄 Tích hợp với Module khác

### **BooksModule:**
- Kiểm tra sách tồn tại khi tạo ebook
- Validate book_type là ebook
- Lấy thông tin sách cho hiển thị

### **AuthorsModule:**
- Lọc ebook theo tác giả
- Thống kê ebook của từng tác giả

### **CategoriesModule:**
- Lọc ebook theo thể loại
- Thống kê ebook theo category

## 🚀 Tính năng Nâng cao

### **1. Quản lý file thông minh:**
- Tracking kích thước file
- Validate định dạng file
- Quản lý đường dẫn file

### **2. Analytics chi tiết:**
- Thống kê lượt tải theo thời gian
- Phân tích xu hướng định dạng
- Báo cáo popular content

### **3. Tạo hàng loạt:**
- Tạo nhiều ebook cùng lúc
- Batch operations
- Tối ưu hóa quy trình upload

### **4. Quản lý dung lượng:**
- Tracking tổng dung lượng
- Cảnh báo khi gần hết dung lượng
- Tối ưu hóa lưu trữ

## 📝 Validation Rules

### **CreateEBookDto:**
- `book_id`: UUID hợp lệ, bắt buộc
- `file_path`: Chuỗi, tối đa 255 ký tự, bắt buộc
- `file_size`: Số nguyên > 0, bắt buộc
- `file_format`: Chuỗi, tối đa 20 ký tự, bắt buộc

### **UpdateEBookDto:**
- Kế thừa tất cả rules từ CreateEBookDto
- Tất cả fields đều tùy chọn

## 🔧 Monitoring và Logging

### **Key Metrics:**
- Số lượng ebook theo định dạng
- Tổng dung lượng lưu trữ
- Lượt tải trung bình
- Ebook phổ biến

### **Error Tracking:**
- Lỗi validation file format
- Lỗi tạo ebook cho sách không phải ebook
- Lỗi file không tồn tại

## 🚀 Roadmap

### **Phase 1 - Core Features:**
- ✅ CRUD operations
- ✅ File management
- ✅ Search và filtering
- ✅ Statistics

### **Phase 2 - Advanced Features:**
- 📋 File upload integration
- 📋 Digital rights management
- 📋 Advanced analytics
- 📋 Content recommendation

### **Phase 3 - Enterprise Features:**
- 📋 Multi-format support
- 📋 Cloud storage integration
- 📋 Advanced reporting
- 📋 Mobile app support

## 📞 Hỗ trợ

**Module Version**: 2.0
**Last Updated**: 2024-01-01
**Dependencies**: BooksModule

**Access Points:**
- Swagger UI: `/api#/Ebooks`
- Base URL: `/ebooks`

**Performance Targets:**
- Search Response: < 200ms
- Create Ebook: < 500ms
- Statistics Generation: < 1s
- Concurrent Operations: 100+
