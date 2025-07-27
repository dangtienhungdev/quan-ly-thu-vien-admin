# 📚 Quản lý Loại Độc Giả (Reader Types Management)

## 📋 Tổng quan

Module quản lý loại độc giả cho phép admin thiết lập và quản lý các loại độc giả khác nhau (sinh viên, giảng viên, nhân viên) với các quyền và giới hạn riêng.

> ⚠️ **Lưu ý quan trọng**: Tất cả các API trong module này yêu cầu:
> 1. Đăng nhập với JWT token hợp lệ
> 2. Người dùng phải có role "admin"

## 🔑 Xác thực API

Tất cả requests phải bao gồm JWT token trong header:
```http
Authorization: Bearer <your_jwt_token>
```

## 📝 Các API Endpoints

### 1. Tạo Loại Độc Giả Mới
```http
POST /api/reader-types
```

**Mô tả:** Tạo một loại độc giả mới trong hệ thống.

**Request Body:**
```json
{
  "typeName": "student",         // Loại độc giả: "student" | "teacher" | "staff"
  "maxBorrowLimit": 5,          // Số sách tối đa được mượn
  "borrowDurationDays": 14,     // Thời gian được mượn (ngày)
  "description": "string",      // Mô tả về loại độc giả
  "lateReturnFinePerDay": 5000  // Tiền phạt trả muộn mỗi ngày (VND)
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "typeName": "student",
  "maxBorrowLimit": 5,
  "borrowDurationDays": 14,
  "description": "Sinh viên đại học",
  "lateReturnFinePerDay": 5000,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Lấy Danh Sách Loại Độc Giả
```http
GET /api/reader-types
```

**Mô tả:** Lấy danh sách tất cả các loại độc giả với phân trang.

**Query Parameters:**
- `page`: Số trang (mặc định: 1)
- `limit`: Số lượng mỗi trang (mặc định: 10)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "typeName": "student",
      "maxBorrowLimit": 5,
      "borrowDurationDays": 14,
      "description": "Sinh viên đại học",
      "lateReturnFinePerDay": 5000,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
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

### 3. Lấy Chi Tiết Loại Độc Giả
```http
GET /api/reader-types/:id
```

**Mô tả:** Lấy thông tin chi tiết của một loại độc giả.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "typeName": "student",
  "maxBorrowLimit": 5,
  "borrowDurationDays": 14,
  "description": "Sinh viên đại học",
  "lateReturnFinePerDay": 5000,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Cập Nhật Loại Độc Giả
```http
PATCH /api/reader-types/:id
```

**Mô tả:** Cập nhật thông tin của một loại độc giả.

**Request Body:**
```json
{
  "maxBorrowLimit": 7,          // Số sách tối đa mới
  "borrowDurationDays": 21,     // Thời gian mượn mới
  "lateReturnFinePerDay": 7000  // Tiền phạt mới
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "typeName": "student",
  "maxBorrowLimit": 7,
  "borrowDurationDays": 21,
  "description": "Sinh viên đại học",
  "lateReturnFinePerDay": 7000,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 5. Xóa Loại Độc Giả
```http
DELETE /api/reader-types/:id
```

**Mô tả:** Xóa một loại độc giả khỏi hệ thống.

**Response:** `204 No Content`

### 6. Lấy Thống Kê Theo Loại Độc Giả
```http
GET /api/reader-types/statistics
```

**Mô tả:** Lấy thống kê số lượng độc giả và sách đang mượn theo từng loại.

**Response:** `200 OK`
```json
{
  "statistics": [
    {
      "typeName": "student",
      "totalReaders": 1000,
      "activeBorrows": 500,
      "averageBorrowDuration": 10,
      "totalFines": 1500000
    }
  ]
}
```

### 7. Lấy Cài Đặt Mặc Định
```http
GET /api/reader-types/default-settings
```

**Mô tả:** Lấy các cài đặt mặc định cho từng loại độc giả.

**Response:** `200 OK`
```json
{
  "student": {
    "maxBorrowLimit": 5,
    "borrowDurationDays": 14,
    "lateReturnFinePerDay": 5000
  },
  "teacher": {
    "maxBorrowLimit": 10,
    "borrowDurationDays": 30,
    "lateReturnFinePerDay": 5000
  },
  "staff": {
    "maxBorrowLimit": 7,
    "borrowDurationDays": 21,
    "lateReturnFinePerDay": 5000
  }
}
```

## 🔒 Validation Rules

### Giới hạn và Quy tắc
1. **typeName:**
   - Chỉ chấp nhận: "student", "teacher", "staff"
   - Không được trùng lặp trong hệ thống

2. **maxBorrowLimit:**
   - Tối thiểu: 1
   - Tối đa: 20
   - Student: 3-5 cuốn
   - Teacher: 10-15 cuốn
   - Staff: 5-10 cuốn

3. **borrowDurationDays:**
   - Tối thiểu: 1
   - Tối đa: 60
   - Student: 14-21 ngày
   - Teacher: 30-45 ngày
   - Staff: 21-30 ngày

4. **lateReturnFinePerDay:**
   - Tối thiểu: 1000 VND
   - Tối đa: 50000 VND

## 🛡️ Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Bạn chưa đăng nhập",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Bạn không có quyền thực hiện hành động này",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Không tìm thấy loại độc giả với ID này",
  "error": "Not Found"
}
```

### 422 Unprocessable Entity
```json
{
  "statusCode": 422,
  "message": "Dữ liệu không hợp lệ",
  "error": "Unprocessable Entity",
  "details": [
    {
      "field": "maxBorrowLimit",
      "message": "Giới hạn mượn phải từ 1 đến 20 cuốn"
    }
  ]
}
```

## 📊 Ví dụ Sử dụng

### Tạo loại độc giả mới
```typescript
const response = await axios.post('/api/reader-types', {
  typeName: 'student',
  maxBorrowLimit: 5,
  borrowDurationDays: 14,
  description: 'Sinh viên đại học',
  lateReturnFinePerDay: 5000
}, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Cập nhật giới hạn mượn
```typescript
const response = await axios.patch('/api/reader-types/uuid', {
  maxBorrowLimit: 7,
  borrowDurationDays: 21
}, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🔄 Business Rules

1. **Không thể xóa loại độc giả nếu:**
   - Có độc giả đang thuộc loại này
   - Có sách đang được mượn bởi độc giả thuộc loại này

2. **Không thể giảm giới hạn mượn nếu:**
   - Có độc giả đang mượn nhiều sách hơn giới hạn mới

3. **Tự động áp dụng thay đổi:**
   - Thay đổi thời hạn mượn chỉ áp dụng cho lượt mượn mới
   - Thay đổi tiền phạt áp dụng cho tất cả sách trả muộn kể từ thời điểm thay đổi

## 📈 Monitoring & Analytics

### Các chỉ số theo dõi:
1. Số lượng độc giả theo từng loại
2. Tỷ lệ sử dụng giới hạn mượn
3. Thời gian mượn trung bình
4. Tổng tiền phạt theo loại độc giả

### Báo cáo tự động:
1. Báo cáo hàng tháng về hoạt động mượn/trả
2. Thống kê vi phạm và phạt
3. Đề xuất điều chỉnh giới hạn dựa trên dữ liệu