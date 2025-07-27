# Module Quản lý Thể loại (Categories)

## 📑 Tổng quan

Module Quản lý Thể loại cung cấp các API để quản lý cấu trúc phân loại sách trong thư viện, hỗ trợ thể loại đa cấp (parent-child categories).

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

### 1. Tạo Thể loại Mới
```http
POST /categories
```
- **Mô tả**: Tạo thể loại mới (có thể là thể loại chính hoặc thể loại con)
- **Role**: Admin
- **Body**:
  ```json
  {
    "category_name": "Sách Khoa Học",
    "description": "Các sách về khoa học, công nghệ",
    "parent_id": "uuid-của-thể-loại-cha" // Optional
  }
  ```
- **Response**: 201 - Thông tin thể loại đã tạo

### 2. Lấy Danh Sách Thể loại
```http
GET /categories
```
- **Mô tả**: Lấy toàn bộ danh sách thể loại có phân trang
- **Query Parameters**:
  - page: Số trang (mặc định: 1)
  - limit: Số lượng mỗi trang (mặc định: 10)
- **Response**: 200 - Danh sách thể loại và thông tin phân trang

### 3. Lấy Danh Sách Thể loại Chính
```http
GET /categories/main
```
- **Mô tả**: Lấy danh sách thể loại chính (không có parent)
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách thể loại chính

### 4. Lấy Danh Sách Thể loại Con
```http
GET /categories/:id/subcategories
```
- **Mô tả**: Lấy danh sách thể loại con của một thể loại
- **Parameters**:
  - id: UUID của thể loại cha
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách thể loại con

### 5. Tìm Kiếm Thể loại
```http
GET /categories/search
```
- **Mô tả**: Tìm kiếm thể loại theo tên hoặc mô tả
- **Query Parameters**:
  - q: Từ khóa tìm kiếm
  - page, limit: Thông tin phân trang
- **Response**: 200 - Kết quả tìm kiếm

### 6. Lấy Chi tiết Thể loại
```http
GET /categories/:id
GET /categories/slug/:slug
```
- **Mô tả**: Lấy thông tin chi tiết của thể loại
- **Response**: 200 - Thông tin thể loại kèm parent và children

### 7. Cập nhật Thể loại
```http
PATCH /categories/:id
PATCH /categories/slug/:slug
```
- **Role**: Admin
- **Body**: UpdateCategoryDto
- **Response**: 200 - Thông tin thể loại sau khi cập nhật

### 8. Xóa Thể loại
```http
DELETE /categories/:id
DELETE /categories/slug/:slug
```
- **Role**: Admin
- **Response**: 204 - Xóa thành công
- **Lưu ý**: Không thể xóa thể loại đang có thể loại con

## 📝 Validation Rules

### CreateCategoryDto
- **category_name**: Bắt buộc, string, max 255 ký tự
- **description**: Optional, string
- **parent_id**: Optional, UUID hợp lệ

### UpdateCategoryDto
- Tất cả trường là optional
- Các quy tắc validation giống CreateCategoryDto

## 🎯 Business Rules

1. **Quy tắc Parent-Child**
   - Một thể loại có thể có nhiều thể loại con
   - Một thể loại chỉ có thể có một thể loại cha
   - Không thể đặt thể loại làm cha của chính nó
   - Không thể đặt thể loại con làm cha của thể loại cha

2. **Quy tắc Xóa**
   - Không thể xóa thể loại đang có thể loại con
   - Phải xóa hết thể loại con trước khi xóa thể loại cha

3. **Quy tắc Slug**
   - Slug được tự động tạo từ category_name
   - Slug phải là unique
   - Slug được sử dụng cho SEO-friendly URLs

## 🔍 Response Format

### Thể loại Đơn lẻ
```json
{
  "id": "uuid",
  "category_name": "Sách Khoa Học",
  "slug": "sach-khoa-hoc",
  "description": "Mô tả",
  "parent_id": "uuid-của-thể-loại-cha",
  "parent": {
    "id": "uuid",
    "category_name": "Tên thể loại cha"
  },
  "children": [
    {
      "id": "uuid",
      "category_name": "Tên thể loại con"
    }
  ],
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
      "category_name": "Tên thể loại",
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

### 1. Tạo Thể loại Chính
```bash
curl -X POST "http://localhost:8000/categories" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "category_name": "Sách Khoa Học",
    "description": "Các sách về khoa học và công nghệ"
  }'
```

### 2. Tạo Thể loại Con
```bash
curl -X POST "http://localhost:8000/categories" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "category_name": "Vật Lý",
    "description": "Sách về vật lý",
    "parent_id": "uuid-của-sách-khoa-học"
  }'
```

### 3. Lấy Cây Thể loại
```bash
# Lấy thể loại chính
curl "http://localhost:8000/categories/main"

# Lấy thể loại con
curl "http://localhost:8000/categories/{id}/subcategories"
```

## 📊 Monitoring

- Theo dõi số lượng thể loại chính/con
- Theo dõi độ sâu của cây thể loại
- Theo dõi số lượng sách trong mỗi thể loại