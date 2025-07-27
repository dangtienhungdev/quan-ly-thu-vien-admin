# 📚 Module Reservations - Quản lý Đặt trước

## 📋 Tổng quan

Module Reservations quản lý hệ thống đặt trước sách trong thư viện, cho phép độc giả đặt trước sách khi chưa có sẵn và thủ thư quản lý quy trình thực hiện đặt trước.

## 🔐 Xác thực và Phân quyền

### **Vai trò được phép:**
- **Reader**: Tạo đặt trước, xem đặt trước của mình
- **Admin**: Tất cả quyền (thực hiện, hủy, quản lý đặt trước)

### **Endpoints yêu cầu quyền Admin:**
- `PATCH /reservations/:id` - Cập nhật đặt trước
- `PATCH /reservations/:id/fulfill` - Thực hiện đặt trước
- `PATCH /reservations/:id/cancel` - Hủy đặt trước
- `POST /reservations/auto-cancel-expired` - Tự động hủy hết hạn
- `DELETE /reservations/:id` - Xóa đặt trước

## 🚀 API Endpoints

### **1. Tạo đặt trước mới**
```http
POST /reservations
```

**Request Body:**
```json
{
  "reader_id": "550e8400-e29b-41d4-a716-446655440000",
  "book_id": "550e8400-e29b-41d4-a716-446655440000",
  "reservation_date": "2024-01-01T10:00:00.000Z",
  "expiry_date": "2024-01-08T10:00:00.000Z",
  "reader_notes": "Cần sách này cho nghiên cứu",
  "priority": 1
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "reader_id": "550e8400-e29b-41d4-a716-446655440000",
  "book_id": "550e8400-e29b-41d4-a716-446655440000",
  "reservation_date": "2024-01-01T10:00:00.000Z",
  "expiry_date": "2024-01-08T10:00:00.000Z",
  "status": "pending",
  "reader_notes": "Cần sách này cho nghiên cứu",
  "priority": 1,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### **2. Lấy danh sách đặt trước**
```http
GET /reservations?page=1&limit=10
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "reader": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "fullName": "Nguyễn Văn A"
      },
      "book": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Sách mẫu"
      },
      "status": "pending",
      "reservation_date": "2024-01-01T10:00:00.000Z",
      "expiry_date": "2024-01-08T10:00:00.000Z"
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

### **3. Tìm kiếm đặt trước**
```http
GET /reservations/search?q=Nguyễn Văn A&page=1&limit=10
```

### **4. Lọc theo trạng thái**
```http
GET /reservations/status/pending?page=1&limit=10
```

### **5. Lọc theo độc giả**
```http
GET /reservations/reader/550e8400-e29b-41d4-a716-446655440000?page=1&limit=10
```

### **6. Lọc theo sách**
```http
GET /reservations/book/550e8400-e29b-41d4-a716-446655440000?page=1&limit=10
```

### **7. Đặt trước sắp hết hạn**
```http
GET /reservations/expiring-soon?days=3
```

### **8. Đặt trước đã hết hạn**
```http
GET /reservations/expired?page=1&limit=10
```

### **9. Thống kê đặt trước**
```http
GET /reservations/stats
```

**Response (200):**
```json
{
  "total": 150,
  "pending": 45,
  "fulfilled": 80,
  "cancelled": 15,
  "expired": 10,
  "byStatus": [
    { "status": "pending", "count": 45 },
    { "status": "fulfilled", "count": 80 },
    { "status": "cancelled", "count": 15 },
    { "status": "expired", "count": 10 }
  ],
  "byMonth": [
    { "month": "2024-01", "count": 25 },
    { "month": "2024-02", "count": 30 }
  ],
  "expiringSoon": 8
}
```

### **10. Thực hiện đặt trước (Admin)**
```http
PATCH /reservations/550e8400-e29b-41d4-a716-446655440000/fulfill
```

**Request Body:**
```json
{
  "librarianId": "550e8400-e29b-41d4-a716-446655440000",
  "notes": "Sách đã sẵn sàng cho độc giả"
}
```

### **11. Hủy đặt trước (Admin)**
```http
PATCH /reservations/550e8400-e29b-41d4-a716-446655440000/cancel
```

**Request Body:**
```json
{
  "librarianId": "550e8400-e29b-41d4-a716-446655440000",
  "reason": "Sách không còn sẵn"
}
```

### **12. Tự động hủy hết hạn (Admin)**
```http
POST /reservations/auto-cancel-expired
```

**Response (200):**
```json
{
  "cancelledCount": 5
}
```

## 📊 Trạng thái Đặt trước

### **ReservationStatus Enum:**
- `pending`: Đang chờ xử lý
- `fulfilled`: Đã thực hiện
- `cancelled`: Đã hủy
- `expired`: Đã hết hạn

## ✅ Quy tắc Nghiệp vụ

### **1. Tạo đặt trước:**
- ✅ Độc giả phải đang hoạt động
- ✅ Sách phải tồn tại trong hệ thống
- ✅ Không được đặt trước trùng lặp (cùng độc giả, cùng sách, trạng thái pending)
- ✅ Ngày hết hạn phải sau ngày đặt trước
- ✅ Tự động tính thứ tự ưu tiên nếu không được chỉ định

### **2. Thực hiện đặt trước:**
- ✅ Chỉ có thể thực hiện đặt trước đang chờ xử lý
- ✅ Phải có sách sẵn sàng (available copies)
- ✅ Tự động cập nhật ngày thực hiện và thủ thư thực hiện

### **3. Hủy đặt trước:**
- ✅ Chỉ có thể hủy đặt trước đang chờ xử lý
- ✅ Tự động cập nhật ngày hủy và thủ thư hủy
- ✅ Có thể ghi chú lý do hủy

### **4. Tự động hủy hết hạn:**
- ✅ Chỉ hủy đặt trước có trạng thái pending
- ✅ Tự động cập nhật lý do hủy
- ✅ Trả về số lượng đã hủy

## 🔍 Tính năng Tìm kiếm

### **Tìm kiếm theo:**
- Tên độc giả
- Tên sách
- Ghi chú của độc giả
- Ghi chú của thủ thư

### **Lọc theo:**
- Trạng thái đặt trước
- Độc giả
- Sách
- Thời gian hết hạn

## 📈 Thống kê và Báo cáo

### **Thống kê tổng quan:**
- Tổng số đặt trước
- Số lượng theo từng trạng thái
- Số đặt trước sắp hết hạn (3 ngày tới)

### **Thống kê theo thời gian:**
- Thống kê theo tháng (6 tháng gần nhất)
- Phân tích xu hướng đặt trước

## ⚡ Tối ưu Hiệu suất

### **Database Indexes:**
```sql
-- Indexes cho performance
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_reader_id ON reservations(reader_id);
CREATE INDEX idx_reservations_book_id ON reservations(book_id);
CREATE INDEX idx_reservations_expiry_date ON reservations(expiry_date);
CREATE INDEX idx_reservations_priority ON reservations(book_id, priority);
```

### **Query Optimization:**
- Sử dụng pagination cho tất cả danh sách
- Eager loading cho relations (reader, book)
- Efficient filtering và sorting

## 🔄 Tích hợp với Module khác

### **BooksModule:**
- Kiểm tra sách tồn tại khi tạo đặt trước
- Lấy thông tin sách cho hiển thị

### **ReadersModule:**
- Kiểm tra độc giả hoạt động
- Lấy thông tin độc giả cho hiển thị

### **PhysicalCopyModule:**
- Kiểm tra sách sẵn sàng khi thực hiện đặt trước
- Cập nhật trạng thái copy khi thực hiện

## 🚀 Tính năng Nâng cao

### **1. Thứ tự ưu tiên:**
- Tự động tính thứ tự ưu tiên theo thời gian đặt trước
- Hỗ trợ chỉ định thứ tự ưu tiên thủ công

### **2. Ghi chú và Tracking:**
- Ghi chú của độc giả khi đặt trước
- Ghi chú của thủ thư khi thực hiện/hủy
- Tracking đầy đủ người thực hiện và thời gian

### **3. Tự động hóa:**
- Tự động hủy đặt trước hết hạn
- Thông báo đặt trước sắp hết hạn
- Tích hợp với hệ thống thông báo

## 📝 Validation Rules

### **CreateReservationDto:**
- `reader_id`: UUID hợp lệ, bắt buộc
- `book_id`: UUID hợp lệ, bắt buộc
- `reservation_date`: Định dạng ngày hợp lệ, bắt buộc
- `expiry_date`: Định dạng ngày hợp lệ, bắt buộc, phải sau reservation_date
- `reader_notes`: Tối đa 500 ký tự, tùy chọn
- `priority`: Số nguyên > 0, tùy chọn

### **UpdateReservationDto:**
- Kế thừa tất cả rules từ CreateReservationDto
- `status`: Enum ReservationStatus, tùy chọn
- `librarian_notes`: Tối đa 500 ký tự, tùy chọn
- `fulfillment_date`: Định dạng ngày hợp lệ, tùy chọn
- `fulfilled_by`: UUID hợp lệ, tùy chọn
- `cancelled_date`: Định dạng ngày hợp lệ, tùy chọn
- `cancellation_reason`: Tối đa 500 ký tự, tùy chọn
- `cancelled_by`: UUID hợp lệ, tùy chọn

## 🔧 Monitoring và Logging

### **Key Metrics:**
- Số lượng đặt trước mới mỗi ngày
- Tỷ lệ đặt trước được thực hiện
- Thời gian trung bình từ đặt trước đến thực hiện
- Số lượng đặt trước hết hạn

### **Error Tracking:**
- Lỗi validation
- Lỗi business logic
- Lỗi database operations

## 🚀 Roadmap

### **Phase 1 - Core Features:**
- ✅ CRUD operations
- ✅ Status management
- ✅ Search và filtering
- ✅ Statistics

### **Phase 2 - Advanced Features:**
- 📋 Email notifications
- 📋 SMS reminders
- 📋 Auto-fulfillment khi có sách
- 📋 Reservation queue management

### **Phase 3 - Enterprise Features:**
- 📋 Multi-library support
- 📋 Advanced analytics
- 📋 Integration với external systems
- 📋 Mobile app support

## 📞 Hỗ trợ

**Module Version**: 1.0
**Last Updated**: 2024-01-01
**Dependencies**: BooksModule, ReadersModule, PhysicalCopyModule

**Access Points:**
- Swagger UI: `/api#/Reservations`
- Base URL: `/reservations`

**Performance Targets:**
- Search Response: < 200ms
- Create Reservation: < 500ms
- Statistics Generation: < 1s
- Concurrent Reservations: 50+