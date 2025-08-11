# Module Quản lý Sách (Books)

## 📑 Tổng quan

Module Quản lý Sách cung cấp các API để quản lý thông tin sách trong hệ thống thư viện. Module này cho phép thực hiện các thao tác CRUD trên sách, bao gồm việc thêm, sửa, xóa và lấy thông tin sách.

- Hỗ trợ gán "thể loại chính" cho sách qua `main_category_id` (tham chiếu `book_categories`)
- Hỗ trợ gán nhiều "khối lớp" cho sách qua `grade_level_ids` (quan hệ N-N qua `book_grade_levels`)

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
  	"category_id": "uuid_of_category",
  	"main_category_id": "uuid_of_book_category", // optional
  	"author_ids": ["uuid_of_author_1", "uuid_of_author_2"],
  	"grade_level_ids": ["uuid_grade_1", "uuid_grade_2"] // optional
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
  - type: Lọc theo loại sách (optional)
    - `physical`: Chỉ lấy sách vật lý
    - `ebook`: Chỉ lấy sách điện tử
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
```

- **Role**: Admin
- **Response**: 204 - Xóa thành công.

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
  		"category_id": "uuid_of_category_1",
  		"main_category_id": "uuid_of_book_category_1",
  		"author_ids": ["uuid_author_1"],
  		"grade_level_ids": ["uuid_grade_1", "uuid_grade_2"]
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
  		"category_id": "uuid_of_category_2",
  		"main_category_id": null,
  		"author_ids": ["uuid_author_2", "uuid_author_3"],
  		"grade_level_ids": []
  	}
  ]
  ```
- **Response**: 201 - Danh sách thông tin sách đã tạo.

## 📝 Validation Rules

### CreateBookDto

- **title**: Bắt buộc, string, max 255 ký tự.
- **isbn**: Bắt buộc, string, unique.
- **publish_year**: Bắt buộc, number.
- **edition**: Optional, string.
- **description**: Optional, string.
- **cover_image**: Optional, string (URL).
- **language**: Bắt buộc, string.
- **page_count**: Bắt buộc, number.
- **book_type**: Bắt buộc, enum (physical, ebook).
- **physical_type**: Optional, enum (library_use, borrowable) – chỉ khi `book_type = physical`.
- **publisher_id**: Bắt buộc, UUID.
- **category_id**: Bắt buộc, UUID.
- **main_category_id**: Optional, UUID (tham chiếu `book_categories.id`).
- **author_ids**: Bắt buộc, array UUID.
- **grade_level_ids**: Optional, array UUID (thiết lập mapping với `grade_levels`).

## 📊 Ví dụ Sử dụng

### 1. Tạo Sách

```bash
curl -X POST "http://localhost:8002/books" \
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
    "category_id": "uuid_of_category",
    "main_category_id": "uuid_of_book_category",
    "author_ids": ["uuid_author_1"],
    "grade_level_ids": ["uuid_grade_1", "uuid_grade_2"]
  }'
```

### 2. Lấy Danh Sách Sách

```bash
# Lấy tất cả sách
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8002/books?page=1&limit=10"

# Lấy chỉ sách vật lý
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8002/books?page=1&limit=10&type=physical"

# Lấy chỉ sách điện tử
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8002/books?page=1&limit=10&type=ebook"
```

### 3. Tìm Kiếm Sách

```bash
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8002/books/search?q=Tên sách"
```

### 4. Lấy Thông Tin Sách Theo ISBN

```bash
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8002/books/isbn/1234567890"
```

### 5. Lấy Chi Tiết Sách

```bash
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8002/books/{id}"
```

### 6. Cập Nhật Sách

```bash
curl -X PATCH "http://localhost:8002/books/{id}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tên sách cập nhật",
    "description": "Mô tả cập nhật",
    "main_category_id": "uuid_book_category_moi",
    "grade_level_ids": ["uuid_grade_1", "uuid_grade_3"]
  }'
```

### 7. Xóa Sách

```bash
curl -X DELETE "http://localhost:8002/books/{id}" \
  -H "Authorization: Bearer {token}"
```

### 8. Tạo Nhiều Sách

```bash
curl -X POST "http://localhost:8002/books/bulk" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '[
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
      "category_id": "uuid_of_category_1",
      "main_category_id": "uuid_of_book_category_1",
      "author_ids": ["uuid_author_1"],
      "grade_level_ids": ["uuid_grade_1", "uuid_grade_2"]
    }
  ]'
```

## 🔍 Response Format

### BookWithAuthors Response (rút gọn)

```json
{
	"id": "uuid",
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
	"slug": "ten-sach",
	"main_category_id": "uuid_of_book_category",
	"authors": [
		{ "id": "author_uuid", "author_name": "Tên tác giả", "slug": "ten-tac-gia" }
	],
	"createdAt": "2024-01-01T00:00:00.000Z",
	"updatedAt": "2024-01-01T00:00:00.000Z"
}
```

> Lưu ý: Các endpoint chi tiết có thể trả thêm `mainCategory` (object) nếu được load quan hệ.

## ⚠️ Lưu ý

1. **Authentication**: Tất cả API đều yêu cầu JWT token hợp lệ
2. **Authorization**: Chỉ admin mới có quyền thêm/sửa/xóa sách
3. **Port**: API chạy trên port 8002
4. **Response Type**: Sử dụng `BookWithAuthorsDto` để trả về thông tin sách kèm tác giả
5. **Bulk Create**: Endpoint `/books/bulk` cho phép tạo nhiều sách cùng lúc
6. **Tích hợp**:
   - `main_category_id` tham chiếu `book_categories`
   - `grade_level_ids` sẽ được đồng bộ qua `book_grade_levels` (ghi đè toàn bộ liên kết hiện có)
