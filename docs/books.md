# Module Quản lý Sách (Books)

## 📑 Tổng quan

Module Quản lý Sách cung cấp các API để quản lý thông tin sách trong hệ thống thư viện. Module này cho phép thực hiện các thao tác CRUD trên sách, bao gồm việc thêm, sửa, xóa và lấy thông tin sách.

## 🔒 Yêu cầu xác thực

- **JWT Authentication**: Tất cả API yêu cầu JWT token hợp lệ.
- **Role Required**: Chỉ user có role `admin` mới có quyền thêm/sửa/xóa.
- **Header**: Gửi kèm Bearer token trong header
  ```
  Authorization: Bearer <your_jwt_token>
  ```

## 📋 Danh sách API Endpoints

### 1. Tạo Sách Mới
```http
POST /books
```
- **Mô tả**: Tạo sách mới trong hệ thống.
- **Role**: Admin
- **Body**:
  ```json
  {
    "title": "Tên sách",
    "isbn": "1234567890",
    "publish_year": 2024,
    "edition": "1st",
    "description": "Mô tả sách",
    "cover_image": "url_to_image",
    "language": "Tiếng Việt",
    "page_count": 300,
    "book_type": "physical",
    "physical_type": "borrowable",
    "publisher_id": "uuid_of_publisher",
    "category_id": "uuid_of_category"
  }
  ```
- **Response**: 201 - Thông tin sách đã tạo.

### 2. Lấy Danh Sách Sách
```http
GET /books
```
- **Mô tả**: Lấy danh sách sách có phân trang.
- **Query Parameters**:
  - page: Số trang (mặc định: 1)
  - limit: Số lượng mỗi trang (mặc định: 10)
- **Response**: 200 - Danh sách sách và thông tin phân trang.

### 3. Tìm Kiếm Sách
```http
GET /books/search
```
- **Mô tả**: Tìm kiếm sách theo tiêu đề hoặc mô tả.
- **Query Parameters**:
  - q: Từ khóa tìm kiếm
  - page, limit: Thông tin phân trang
- **Response**: 200 - Kết quả tìm kiếm.

### 4. Lấy Thông Tin Sách Theo ISBN
```http
GET /books/isbn/:isbn
```
- **Mô tả**: Lấy thông tin sách theo ISBN.
- **Response**: 200 - Thông tin sách.

### 5. Lấy Chi Tiết Sách
```http
GET /books/:id
```
- **Mô tả**: Lấy thông tin chi tiết của sách theo ID.
- **Response**: 200 - Thông tin sách.

### 6. Lấy Thông Tin Sách Theo Slug
```http
GET /books/slug/:slug
```
- **Mô tả**: Lấy thông tin sách theo slug.
- **Response**: 200 - Thông tin sách.

### 7. Cập Nhật Sách Theo ID
```http
PATCH /books/:id
```
- **Role**: Admin
- **Body**: Cập nhật thông tin sách.
- **Response**: 200 - Thông tin sách sau khi cập nhật.

### 8. Cập Nhật Sách Theo Slug
```http
PATCH /books/slug/:slug
```
- **Role**: Admin
- **Body**: Cập nhật thông tin sách.
- **Response**: 200 - Thông tin sách sau khi cập nhật.

### 9. Xóa Sách Theo ID
```http
DELETE /books/:id
```
- **Role**: Admin
- **Response**: 204 - Xóa thành công.

### 10. Xóa Sách Theo Slug
```http
DELETE /books/slug/:slug

### 11. Tạo Nhiều Sách
```http
POST /books/bulk
```
- **Mô tả**: Tạo nhiều sách cùng lúc trong hệ thống.
- **Role**: Admin
- **Body**:
  ```json
  [
    {
      "title": "Tên sách 1",
      "isbn": "1234567890",
      "publish_year": 2024,
      "edition": "1st",
      "description": "Mô tả sách 1",
      "cover_image": "url_to_image_1",
      "language": "Tiếng Việt",
      "page_count": 300,
      "book_type": "physical",
      "physical_type": "borrowable",
      "publisher_id": "uuid_of_publisher_1",
      "category_id": "uuid_of_category_1"
    },
    {
      "title": "Tên sách 2",
      "isbn": "0987654321",
      "publish_year": 2024,
      "edition": "1st",
      "description": "Mô tả sách 2",
      "cover_image": "url_to_image_2",
      "language": "Tiếng Việt",
      "page_count": 250,
      "book_type": "physical",
      "physical_type": "borrowable",
      "publisher_id": "uuid_of_publisher_2",
      "category_id": "uuid_of_category_2"
    }
  ]
  ```
- **Response**: 201 - Danh sách thông tin sách đã tạo.

```
- **Role**: Admin
- **Response**: 204 - Xóa thành công.

## 📝 Validation Rules

### CreateBookDto
- **title**: Bắt buộc, string, max 255 ký tự.
- **isbn**: Bắt buộc, string, unique.
- **publish_year**: Bắt buộc, number.
- **edition**: Bắt buộc, string.
- **description**: Optional, string.
- **cover_image**: Optional, string (URL).
- **language**: Bắt buộc, string.
- **page_count**: Bắt buộc, number.
- **book_type**: Bắt buộc, enum (physical, ebook).
- **physical_type**: Bắt buộc, enum (library_use, borrowable).
- **publisher_id**: Bắt buộc, UUID.
- **category_id**: Bắt buộc, UUID.

## 📊 Ví dụ Sử dụng

### 1. Tạo Sách
```bash
curl -X POST "http://localhost:8000/books" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tên sách",
    "isbn": "1234567890",
    "publish_year": 2024,
    "edition": "1st",
    "description": "Mô tả sách",
    "cover_image": "url_to_image",
    "language": "Tiếng Việt",
    "page_count": 300,
    "book_type": "physical",
    "physical_type": "borrowable",
    "publisher_id": "uuid_of_publisher",
    "category_id": "uuid_of_category"
  }'
```

### 2. Lấy Danh Sách Sách
```bash
curl "http://localhost:8000/books?page=1&limit=10"
```

### 3. Tìm Kiếm Sách
```bash
curl "http://localhost:8000/books/search?q=Tên sách"
```

### 4. Lấy Thông Tin Sách Theo ISBN
```bash
curl "http://localhost:8000/books/isbn/1234567890"
```

### 5. Lấy Chi Tiết Sách
```bash
curl "http://localhost:8000/books/{id}"
```

### 6. Cập Nhật Sách
```bash
curl -X PATCH "http://localhost:8000/books/{id}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tên sách cập nhật",
    "description": "Mô tả cập nhật"
  }'
```

### 7. Xóa Sách
```bash
curl -X DELETE "http://localhost:8000/books/{id}" \
  -H "Authorization: Bearer {token}"
```

```

Mẫu này đã được cập nhật để bao gồm tất cả các API endpoints từ file `books.controller.ts`. Bạn có thể điều chỉnh nội dung và các chi tiết khác trong file `README.md` này để phù hợp hơn với yêu cầu và phong cách của dự án của bạn. Nếu bạn cần thêm thông tin hoặc có yêu cầu cụ thể nào khác, hãy cho tôi biết!