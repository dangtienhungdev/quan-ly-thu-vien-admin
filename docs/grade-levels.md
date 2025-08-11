# 🎓 Module Grade Levels - Quản lý Khối lớp

## 📋 Tổng quan

Module Grade Levels quản lý danh mục khối/lớp áp dụng cho sách (VD: "Lớp 1", "THCS", "Đại học"). Dùng để phân loại đối tượng độc giả phù hợp theo độ tuổi/cấp học và liên kết với sách qua module `Book Grade Levels`.

- ✅ Tên khối lớp unique
- ✅ Sắp xếp hiển thị theo trường `order`
- ✅ Swagger tiếng Việt đầy đủ
- ✅ Bảo vệ bằng JWT + Roles (admin)

## 🏗️ Database Schema

```sql
CREATE TABLE grade_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT NULL,
  order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Entity

```typescript
interface GradeLevel {
  id: string; // UUID
  name: string; // Unique (ví dụ: "Lớp 1", "Đại học")
  description?: string;
  order: number; // Thứ tự sắp xếp
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 API Endpoints

Lưu ý: Tất cả endpoints yêu cầu Bearer Token và quyền admin.

### 1) Tạo khối lớp mới

```http
POST /grade-levels
```

Request Body:

```json
{
  "name": "Lớp 1",
  "description": "Dành cho học sinh lớp 1",
  "order": 1
}
```

### 2) Danh sách (phân trang)

```http
GET /grade-levels?page=1&limit=10
```

### 3) Danh sách không phân trang

```http
GET /grade-levels/all
```

### 4) Tìm kiếm theo tên/mô tả

```http
GET /grade-levels/search?q=lop&page=1&limit=10
```

### 5) Chi tiết theo ID

```http
GET /grade-levels/:id
```

### 6) Cập nhật

```http
PATCH /grade-levels/:id
```

Request Body (ví dụ):

```json
{
  "name": "Tiểu học",
  "order": 2
}
```

### 7) Xóa

```http
DELETE /grade-levels/:id
```

## 🛡️ Validation & Security

- 🔐 Auth: JWT + RolesGuard (role: `admin`)
- ✅ Name: bắt buộc, unique, tối đa 50 ký tự
- ✅ Order: số nguyên >= 0 (mặc định: 0)
- ✅ Description: tùy chọn

## 📜 Business Rules

- Tên khối lớp không trùng lặp
- Dùng `order` để sắp xếp hiển thị (tăng dần)
- Cho phép đổi tên/description/order an toàn

## 🔗 Tích hợp với Books

- Liên kết N-N với sách thông qua module `Book Grade Levels`
- Gợi ý luồng tạo/cập nhật sách:
  1. Tạo/đảm bảo tồn tại các `GradeLevel`
  2. Thiết lập `grade_level_ids` cho sách (qua endpoint `book-grade-levels/set-for-book` hoặc DTO của `books`)

## 📈 Ví dụ Response

Danh sách (200):

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Lớp 1",
      "description": "Dành cho học sinh lớp 1",
      "order": 1,
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
  "name": "Lớp 1",
  "description": "Dành cho học sinh lớp 1",
  "order": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## ⚙️ Swagger

- Tag: `Grade Levels - Quản lý Khối lớp`
- Guard: `@ApiBearerAuth()` ở cấp controller
- Mô tả tiếng Việt cho tất cả endpoints

## 📁 Cấu trúc Files

```
src/grade-levels/
├── dto/
│   ├── create-grade-level.dto.ts
│   └── update-grade-level.dto.ts
├── entities/
│   └── grade-level.entity.ts
├── grade-levels.controller.ts
├── grade-levels.module.ts
└── grade-levels.service.ts
```

## ⚡ Hiệu năng & Indexes

```sql
-- Unique theo tên
CREATE UNIQUE INDEX grade_levels_name_unique_idx ON grade_levels(name);
-- Gợi ý sắp xếp theo order
CREATE INDEX grade_levels_order_idx ON grade_levels(order);
```

## 🧪 Gợi ý Test nhanh (cURL)

```bash
# Tạo
curl -X POST http://localhost:8000/grade-levels \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Lớp 1","description":"Dành cho học sinh lớp 1","order":1}'

# Danh sách phân trang
curl "http://localhost:8000/grade-levels?page=1&limit=10" \
  -H "Authorization: Bearer <TOKEN>"

# Tìm kiếm
curl "http://localhost:8000/grade-levels/search?q=lop" \
  -H "Authorization: Bearer <TOKEN>"

# Cập nhật
curl -X PATCH http://localhost:8000/grade-levels/<id> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tiểu học","order":2}'

# Xóa
curl -X DELETE http://localhost:8000/grade-levels/<id> \
  -H "Authorization: Bearer <TOKEN>"
```

## 📝 Ghi chú

- Tất cả endpoints yêu cầu quyền admin (RolesGuard)
- `order` càng nhỏ thì hiển thị càng ưu tiên
- Nên chuẩn hóa danh mục khối lớp (không trùng nghĩa) để hỗ trợ tìm kiếm và gợi ý tốt hơn
