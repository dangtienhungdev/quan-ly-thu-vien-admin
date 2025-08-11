# 🔗 Module Book Grade Levels - Liên kết Sách - Khối lớp

## 📋 Tổng quan

Module Book Grade Levels quản lý quan hệ N-N giữa Sách (`Books`) và Khối lớp (`GradeLevels`).

- ✅ Composite key (book_id, grade_level_id)
- ✅ Endpoints quản lý liên kết (tạo, xóa, liệt kê)
- ✅ Endpoint bulk set cho 1 sách (ghi đè toàn bộ)
- ✅ Swagger tiếng Việt, bảo vệ bằng JWT + Roles (admin)

## 🏗️ Database Schema

```sql
CREATE TABLE book_grade_levels (
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  grade_level_id UUID NOT NULL REFERENCES grade_levels(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, grade_level_id)
);
```

### Entity

```typescript
interface BookGradeLevel {
  book_id: string; // UUID (PK, FK -> books.id)
  grade_level_id: string; // UUID (PK, FK -> grade_levels.id)
}
```

## 🚀 API Endpoints

Lưu ý: Tất cả endpoints yêu cầu Bearer Token và quyền admin.

### 1) Tạo liên kết Sách - Khối lớp

```http
POST /book-grade-levels
```

Request Body:

```json
{
  "book_id": "550e8400-e29b-41d4-a716-446655440000",
  "grade_level_id": "550e8400-e29b-41d4-a716-446655440111"
}
```

Response (201): Trả về liên kết vừa tạo

### 2) Xóa liên kết Sách - Khối lớp

```http
DELETE /book-grade-levels/:bookId/:gradeLevelId
```

Response (204): No Content

### 3) Danh sách khối lớp của 1 sách

```http
GET /book-grade-levels/book/:bookId
```

Response (200): Mảng các mapping `{ book_id, grade_level_id }`

### 4) Danh sách sách thuộc 1 khối lớp

```http
GET /book-grade-levels/grade-level/:gradeLevelId
```

Response (200): Mảng các mapping `{ book_id, grade_level_id }`

### 5) Thiết lập danh sách khối lớp cho 1 sách (ghi đè)

```http
POST /book-grade-levels/set-for-book
```

Request Body:

```json
{
  "book_id": "550e8400-e29b-41d4-a716-446655440000",
  "grade_level_ids": [
    "550e8400-e29b-41d4-a716-446655440111",
    "550e8400-e29b-41d4-a716-446655440222"
  ]
}
```

Response (200): `{ book_id, grade_level_ids }`

## 🛡️ Validation & Security

- 🔐 Auth: JWT + RolesGuard (role: `admin`)
- ✅ `book_id`, `grade_level_id` là UUID hợp lệ
- ✅ Composite key: không trùng lặp cặp (book_id, grade_level_id)
- 🔁 `set-for-book`: xóa toàn bộ liên kết cũ, tạo danh sách mới theo `grade_level_ids`

## 📜 Business Rules

- Một sách có thể thuộc nhiều khối lớp; một khối lớp có thể gắn cho nhiều sách
- Khi xóa sách/khối lớp, liên kết tương ứng bị xóa (ON DELETE CASCADE)
- Gợi ý: Khi tạo/cập nhật sách, thiết lập danh sách khối lớp qua endpoint `set-for-book`

## 🔗 Tích hợp với Books / GradeLevels

- `BooksService` gọi `POST /book-grade-levels/set-for-book` để đồng bộ `grade_level_ids`
- `GradeLevels` được quản lý tại module `grade-levels`; cần tạo trước rồi mới liên kết cho sách

## 📈 Ví dụ Response

Danh sách theo sách (200):

```json
[
  { "book_id": "...0000", "grade_level_id": "...0111" },
  { "book_id": "...0000", "grade_level_id": "...0222" }
]
```

Kết quả set-for-book (200):

```json
{ "book_id": "...0000", "grade_level_ids": ["...0111", "...0222"] }
```

## ⚙️ Swagger

- Tag: `Book Grade Levels - Liên kết Sách - Khối lớp`
- Guard: `@ApiBearerAuth()` ở cấp controller
- Mô tả tiếng Việt cho tất cả endpoints

## 📁 Cấu trúc Files

```
src/book-grade-levels/
├── dto/
│   └── create-book-grade-level.dto.ts     # DTO tạo + bulk set
├── entities/
│   └── book-grade-level.entity.ts         # Entity mapping
├── book-grade-levels.controller.ts        # REST endpoints
├── book-grade-levels.module.ts            # Module definition
└── book-grade-levels.service.ts           # Business logic
```

## ⚡ Hiệu năng & Indexes

```sql
-- Tăng tốc tra cứu theo sách
CREATE INDEX book_grade_levels_book_id_idx ON book_grade_levels(book_id);
-- Tăng tốc tra cứu theo khối lớp
CREATE INDEX book_grade_levels_grade_level_id_idx ON book_grade_levels(grade_level_id);
```

## 🧪 Gợi ý Test nhanh (cURL)

```bash
# Thêm liên kết Sách - Khối lớp
curl -X POST http://localhost:8000/book-grade-levels \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"book_id":"<BOOK_ID>","grade_level_id":"<GRADE_LEVEL_ID>"}'

# Danh sách khối lớp của sách
curl "http://localhost:8000/book-grade-levels/book/<BOOK_ID>" \
  -H "Authorization: Bearer <TOKEN>"

# Danh sách sách theo khối lớp
curl "http://localhost:8000/book-grade-levels/grade-level/<GRADE_LEVEL_ID>" \
  -H "Authorization: Bearer <TOKEN>"

# Ghi đè danh sách khối lớp của sách
curl -X POST http://localhost:8000/book-grade-levels/set-for-book \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"book_id":"<BOOK_ID>","grade_level_ids":["<G1>","<G2>"]}'

# Xóa liên kết
curl -X DELETE http://localhost:8000/book-grade-levels/<BOOK_ID>/<GRADE_LEVEL_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

## 📝 Ghi chú

- Với `set-for-book`, hãy gửi toàn bộ `grade_level_ids` mong muốn; các liên kết cũ không có trong danh sách sẽ bị xóa
- Nên validate sự tồn tại của `book_id` và `grade_level_id` ở tầng gọi (Books/GradeLevels) hoặc mở rộng service để kiểm tra nếu cần
