# Module Quản lý Tác giả (Authors)

## 📑 Tổng quan

Module Quản lý Tác giả cung cấp các API để quản lý thông tin tác giả trong hệ thống thư viện.

## 🔒 Yêu cầu xác thực

- **JWT Authentication**: Tất cả API yêu cầu JWT token hợp lệ
- **Role Required**: Chỉ user có role `admin` mới có quyền thêm/sửa/xóa
- **Header**: Gửi kèm Bearer token trong header
  ```
  Authorization: Bearer <your_jwt_token>
  ```

## 🔑 Quyền hạn

- ✅ ADMIN: Có quyền thực hiện tất cả các operations
- ✅ USER: Chỉ có quyền xem (GET endpoints)

## 📋 Danh sách API Endpoints

### 1. Tạo Tác giả Mới
```http
POST /authors
```
- **Mô tả**: Tạo tác giả mới trong hệ thống
- **Role**: Admin
- **Body**:
  ```json
  {
    "author_name": "Nguyễn Nhật Ánh",
    "bio": "Nhà văn chuyên viết cho thanh thiếu niên...",
    "nationality": "Việt Nam"
  }
  ```
- **Response**: 201 - Thông tin tác giả đã tạo

### 2. Tạo Nhiều Tác giả
```http
POST /authors/bulk
```
- **Mô tả**: Tạo nhiều tác giả cùng lúc
- **Role**: Admin
- **Body**:
  ```json
  {
    "authors": [
      {
        "author_name": "Nguyễn Nhật Ánh",
        "bio": "Nhà văn chuyên viết cho thanh thiếu niên...",
        "nationality": "Việt Nam"
      },
      {
        "author_name": "Tô Hoài",
        "bio": "Tác giả của Dế Mèn Phiêu Lưu Ký...",
        "nationality": "Việt Nam"
      }
    ]
  }
  ```
- **Validation**:
  - Mảng authors không được rỗng
  - Mỗi tác giả phải tuân thủ các quy tắc validation của CreateAuthorDto
- **Response**: 201 - Mảng thông tin các tác giả đã tạo

### 2. Lấy Danh Sách Tác giả
```http
GET /authors
```
- **Mô tả**: Lấy danh sách tác giả có phân trang
- **Query Parameters**:
  - page: Số trang (mặc định: 1)
  - limit: Số lượng mỗi trang (mặc định: 10)
- **Response**: 200 - Danh sách tác giả và thông tin phân trang

### 3. Tìm Kiếm Tác giả
```http
GET /authors/search
```
- **Mô tả**: Tìm kiếm tác giả theo tên, tiểu sử hoặc quốc tịch
- **Query Parameters**:
  - q: Từ khóa tìm kiếm
  - page, limit: Thông tin phân trang
- **Response**: 200 - Kết quả tìm kiếm

### 4. Lấy Tác giả Theo Quốc tịch
```http
GET /authors/nationality/:nationality
```
- **Mô tả**: Lấy danh sách tác giả theo quốc tịch
- **Parameters**:
  - nationality: Tên quốc tịch
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách tác giả

### 5. Lấy Chi tiết Tác giả
```http
GET /authors/:id
GET /authors/slug/:slug
```
- **Mô tả**: Lấy thông tin chi tiết của tác giả
- **Response**: 200 - Thông tin tác giả

### 6. Cập nhật Tác giả
```http
PATCH /authors/:id
PATCH /authors/slug/:slug
```
- **Role**: Admin
- **Body**: UpdateAuthorDto
- **Response**: 200 - Thông tin tác giả sau khi cập nhật

### 7. Xóa Tác giả
```http
DELETE /authors/:id
DELETE /authors/slug/:slug
```
- **Role**: Admin
- **Response**: 204 - Xóa thành công

## 📝 Validation Rules

### CreateAuthorDto
- **author_name**: Bắt buộc, string, max 255 ký tự
- **bio**: Optional, string
- **nationality**: Bắt buộc, string, max 100 ký tự

### UpdateAuthorDto
- Tất cả trường là optional
- Các quy tắc validation giống CreateAuthorDto

## 🎯 Business Rules

1. **Quy tắc Tên**
   - Tên tác giả là duy nhất
   - Slug được tự động tạo từ tên
   - Slug phải là unique

2. **Quy tắc Quốc tịch**
   - Quốc tịch là bắt buộc
   - Hỗ trợ tìm kiếm theo quốc tịch

3. **Quy tắc Slug**
   - Slug được tự động tạo từ tên tác giả
   - Slug được sử dụng cho SEO-friendly URLs

## 🔍 Response Format

### Tác giả Đơn lẻ
```json
{
  "id": "uuid",
  "author_name": "Nguyễn Nhật Ánh",
  "slug": "nguyen-nhat-anh",
  "bio": "Nhà văn chuyên viết cho thanh thiếu niên...",
  "nationality": "Việt Nam",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Danh sách có Phân trang
```json
{
  "data": [
    {
      "id": "uuid",
      "author_name": "Tên tác giả",
      // ... các trường khác
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## 🚀 Ví dụ Sử dụng

### 1. Tạo Tác giả
```bash
curl -X POST "http://localhost:8000/authors" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "author_name": "Nguyễn Nhật Ánh",
    "bio": "Nhà văn chuyên viết cho thanh thiếu niên...",
    "nationality": "Việt Nam"
  }'
```

### 2. Tìm Kiếm Tác giả
```bash
# Tìm theo từ khóa
curl "http://localhost:8000/authors/search?q=Nguyễn"

# Tìm theo quốc tịch
curl "http://localhost:8000/authors/nationality/Việt%20Nam"
```

### 3. Tạo Nhiều Tác giả
```bash
curl -X POST "http://localhost:8000/authors/bulk" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "authors": [
      {
        "author_name": "Nguyễn Nhật Ánh",
        "bio": "Nhà văn chuyên viết cho thanh thiếu niên...",
        "nationality": "Việt Nam"
      },
      {
        "author_name": "Tô Hoài",
        "bio": "Tác giả của Dế Mèn Phiêu Lưu Ký...",
        "nationality": "Việt Nam"
      }
    ]
  }'
```

## 📊 Monitoring

- Theo dõi số lượng tác giả theo quốc tịch
- Theo dõi số lượng sách của mỗi tác giả
- Theo dõi tác giả được tìm kiếm nhiều nhất