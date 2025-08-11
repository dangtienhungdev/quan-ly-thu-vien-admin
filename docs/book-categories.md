# 🗂️ Module Book Categories - Quản lý Thể loại Chi tiết

## 📋 Tổng quan

Module Book Categories quản lý hệ thống thể loại chi tiết của sách theo mô hình phân cấp (parent/child). Dùng để gắn "thể loại chính" cho sách và tổ chức danh mục sách theo chiều sâu.

- ✅ Tên thể loại unique
- ✅ Hỗ trợ danh mục cha (self-reference)
- ✅ Swagger tiếng Việt đầy đủ
- ✅ Bảo vệ bằng JWT + Roles (admin)

## 🏗️ Database Schema

```sql
CREATE TABLE book_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  parent_id UUID NULL REFERENCES book_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Entity

```typescript
interface BookCategory {
  id: string; // UUID
  name: string; // Unique
  parent_id?: string; // UUID | null
  parent?: BookCategory; // Quan hệ cha
  children?: BookCategory[]; // Danh sách con
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 API Endpoints

Lưu ý: Tất cả endpoints yêu cầu Bearer Token và quyền admin.

### 1) Tạo thể loại mới

```http
POST /book-categories
```

Request Body:

```json
{
  "name": "Sách Toán",
  "parent_id": null
}
```

### 2) Danh sách (phân trang)

```http
GET /book-categories?page=1&limit=10
```

### 3) Danh sách không phân trang

```http
GET /book-categories/all
```

### 4) Tìm kiếm theo tên

```http
GET /book-categories/search?q=toan&page=1&limit=10
```

### 5) Chi tiết theo ID

```http
GET /book-categories/:id
```

### 6) Cập nhật

```http
PATCH /book-categories/:id
```

Request Body (ví dụ):

```json
{
  "name": "Sách Toán học",
  "parent_id": null
}
```

### 7) Xóa

```http
DELETE /book-categories/:id
```

## 🛡️ Validation & Security

- 🔐 Auth: JWT + RolesGuard (role: `admin`)
- ✅ Name: bắt buộc, unique, tối đa 100 ký tự
- ✅ Parent: nếu có `parent_id` thì phải tồn tại; không được đặt parent là chính nó
- 🔁 Xóa parent: các con tự động `SET NULL` (không xóa cascade)

## 📜 Business Rules

- Tên thể loại không trùng lặp
- Hỗ trợ phân cấp nhiều tầng (parent → children)
- Cho phép đổi `parent_id` (không tự tham chiếu)
- Tối ưu cho tra cứu theo tên và duyệt cây đơn giản

## 🔗 Tích hợp với Books

- Trường `books.main_category_id` tham chiếu `book_categories.id` để xác định "thể loại chính" của sách
- Gợi ý luồng tạo/cập nhật sách:
  1. Tạo/đảm bảo tồn tại `BookCategory`
  2. Tạo/ cập nhật `Book` với `main_category_id`

## 📈 Ví dụ Response

Danh sách (200):

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Sách Toán",
      "parent_id": null,
      "parent": null,
      "children": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

Chi tiết (200):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Sách Toán",
  "parent_id": null,
  "parent": null,
  "children": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## ⚙️ Cấu hình Swagger

- Tag: `Book Categories - Quản lý Thể loại chi tiết`
- Guard: `@ApiBearerAuth()` ở cấp controller
- Mô tả tiếng Việt cho tất cả endpoints

## 📁 Cấu trúc Files

```
src/book-categories/
├── dto/
│   ├── create-book-category.dto.ts
│   └── update-book-category.dto.ts
├── entities/
│   └── book-category.entity.ts
├── book-categories.controller.ts
├── book-categories.module.ts
└── book-categories.service.ts
```

## ⚡ Hiệu năng & Indexes

```sql
-- Duy nhất theo tên
CREATE UNIQUE INDEX book_categories_name_unique_idx ON book_categories(name);
-- Tra cứu theo parent
CREATE INDEX book_categories_parent_id_idx ON book_categories(parent_id);
```

## 🧪 Gợi ý Test nhanh (cURL)

```bash
# Tạo
curl -X POST http://localhost:8000/book-categories \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Sách Toán"}'

# Danh sách phân trang
curl "http://localhost:8000/book-categories?page=1&limit=10" \
  -H "Authorization: Bearer <TOKEN>"

# Tìm kiếm
curl "http://localhost:8000/book-categories/search?q=toan" \
  -H "Authorization: Bearer <TOKEN>"

# Cập nhật
curl -X PATCH http://localhost:8000/book-categories/<id> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Sách Toán học"}'

# Xóa
curl -X DELETE http://localhost:8000/book-categories/<id> \
  -H "Authorization: Bearer <TOKEN>"
```

## 📝 Ghi chú

- Tất cả endpoints yêu cầu quyền admin (RolesGuard)
- Xóa danh mục cha không xóa danh mục con; con sẽ có `parent_id = null`
- Nên chuẩn hóa danh mục (chuẩn tên, không trùng nghĩa) để tối ưu tìm kiếm
