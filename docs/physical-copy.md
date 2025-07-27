# 📚 Module Physical Copy - Quản lý Bản sao Vật lý

## 📋 Tổng quan

Module Physical Copy quản lý các bản sao vật lý của sách trong thư viện, bao gồm việc theo dõi trạng thái, tình trạng, vị trí và quản lý vòng đời của từng bản sao.

## 🔐 Xác thực và Phân quyền

### **Vai trò được phép:**
- **Reader**: Xem danh sách bản sao, tìm kiếm theo barcode
- **Admin**: Tất cả quyền (tạo, cập nhật, xóa, quản lý trạng thái)

### **Endpoints yêu cầu quyền Admin:**
- `POST /physical-copies` - Tạo bản sao mới
- `POST /physical-copies/book/:bookId/many` - Tạo nhiều bản sao
- `PATCH /physical-copies/:id` - Cập nhật bản sao
- `PATCH /physical-copies/:id/status` - Cập nhật trạng thái
- `PATCH /physical-copies/:id/condition` - Cập nhật tình trạng
- `PATCH /physical-copies/:id/archive` - Lưu trữ/Bỏ lưu trữ
- `DELETE /physical-copies/:id` - Xóa bản sao

## 🚀 API Endpoints

### **1. Tạo bản sao mới**
```http
POST /physical-copies
```

**Request Body:**
```json
{
  "book_id": "550e8400-e29b-41d4-a716-446655440000",
  "barcode": "LIB-2024-001",
  "purchase_date": "2024-01-01",
  "purchase_price": 75000,
  "location": "Kệ A2-T3",
  "current_condition": "new",
  "condition_details": "Sách mới hoàn toàn"
}
```

### **2. Tạo nhiều bản sao cùng lúc**
```http
POST /physical-copies/book/550e8400-e29b-41d4-a716-446655440000/many
```

**Request Body:**
```json
{
  "count": 5,
  "purchase_date": "2024-01-01",
  "purchase_price": 75000,
  "location": "Kệ A2-T3"
}
```

### **3. Lấy danh sách tất cả bản sao**
```http
GET /physical-copies?page=1&limit=10
```

### **4. Tìm kiếm bản sao**
```http
GET /physical-copies/search?q=Kệ A2&page=1&limit=10
```

### **5. Lọc theo trạng thái**
```http
GET /physical-copies/status/available?page=1&limit=10
```

### **6. Lọc theo tình trạng**
```http
GET /physical-copies/condition/good?page=1&limit=10
```

### **7. Lọc theo vị trí**
```http
GET /physical-copies/location/Kệ A2-T3?page=1&limit=10
```

### **8. Bản sao sẵn sàng cho mượn**
```http
GET /physical-copies/available?page=1&limit=10
```

### **9. Bản sao cần bảo trì**
```http
GET /physical-copies/maintenance?page=1&limit=10
```

### **10. Thống kê bản sao**
```http
GET /physical-copies/stats
```

**Response (200):**
```json
{
  "total": 150,
  "available": 80,
  "borrowed": 45,
  "reserved": 10,
  "damaged": 8,
  "lost": 2,
  "maintenance": 5,
  "archived": 0,
  "byCondition": [
    { "condition": "new", "count": 50 },
    { "condition": "good", "count": 70 },
    { "condition": "worn", "count": 25 },
    { "condition": "damaged", "count": 5 }
  ],
  "byLocation": [
    { "location": "Kệ A2-T3", "count": 30 },
    { "location": "Kệ B1-T1", "count": 25 }
  ],
  "totalValue": 11250000
}
```

### **11. Lấy bản sao theo sách**
```http
GET /physical-copies/book/550e8400-e29b-41d4-a716-446655440000?page=1&limit=10
```

### **12. Tìm theo barcode**
```http
GET /physical-copies/barcode/LIB-2024-001
```

### **13. Lấy chi tiết bản sao**
```http
GET /physical-copies/550e8400-e29b-41d4-a716-446655440000
```

### **14. Cập nhật bản sao**
```http
PATCH /physical-copies/550e8400-e29b-41d4-a716-446655440000
```

### **15. Cập nhật trạng thái (Admin)**
```http
PATCH /physical-copies/550e8400-e29b-41d4-a716-446655440000/status
```

**Request Body:**
```json
{
  "status": "borrowed",
  "notes": "Đang được mượn bởi độc giả"
}
```

### **16. Cập nhật tình trạng (Admin)**
```http
PATCH /physical-copies/550e8400-e29b-41d4-a716-446655440000/condition
```

**Request Body:**
```json
{
  "condition": "worn",
  "details": "Có vài trang bị gấp mép"
}
```

### **17. Lưu trữ/Bỏ lưu trữ (Admin)**
```http
PATCH /physical-copies/550e8400-e29b-41d4-a716-446655440000/archive
```

### **18. Xóa bản sao (Admin)**
```http
DELETE /physical-copies/550e8400-e29b-41d4-a716-446655440000
```

## 📊 Trạng thái và Tình trạng

### **CopyStatus Enum:**
- `available`: Sẵn sàng cho mượn
- `borrowed`: Đang được mượn
- `reserved`: Đã được đặt trước
- `damaged`: Bị hư hỏng
- `lost`: Bị mất
- `maintenance`: Đang bảo trì

### **CopyCondition Enum:**
- `new`: Mới
- `good`: Tốt
- `worn`: Cũ
- `damaged`: Hư hỏng

## ✅ Quy tắc Nghiệp vụ

### **1. Tạo bản sao:**
- ✅ Chỉ có thể tạo bản sao cho sách vật lý
- ✅ Barcode phải unique
- ✅ Tự động tạo barcode nếu tạo nhiều bản sao
- ✅ Mặc định trạng thái available, tình trạng new

### **2. Quản lý trạng thái:**
- ✅ Chỉ admin có thể thay đổi trạng thái
- ✅ Khi lưu trữ, tự động chuyển sang maintenance
- ✅ Tracking đầy đủ thời gian thay đổi

### **3. Quản lý tình trạng:**
- ✅ Tự động cập nhật ngày kiểm tra cuối
- ✅ Ghi chú chi tiết về tình trạng
- ✅ Ảnh hưởng đến khả năng mượn sách

### **4. Tìm kiếm và lọc:**
- ✅ Tìm kiếm theo barcode, vị trí, ghi chú, tên sách
- ✅ Lọc theo trạng thái, tình trạng, vị trí
- ✅ Phân trang cho tất cả danh sách

## 🔍 Tính năng Tìm kiếm

### **Tìm kiếm theo:**
- Barcode của bản sao
- Vị trí trong thư viện
- Ghi chú và chi tiết tình trạng
- Tên sách

### **Lọc theo:**
- Trạng thái bản sao
- Tình trạng bản sao
- Vị trí trong thư viện
- Sách cụ thể

## 📈 Thống kê và Báo cáo

### **Thống kê tổng quan:**
- Tổng số bản sao
- Số lượng theo từng trạng thái
- Số lượng theo từng tình trạng
- Tổng giá trị bản sao

### **Thống kê theo vị trí:**
- Phân bố bản sao theo kệ
- Tối ưu hóa không gian lưu trữ

## ⚡ Tối ưu Hiệu suất

### **Database Indexes:**
```sql
-- Indexes cho performance
CREATE INDEX idx_physical_copies_status ON physical_copies(status);
CREATE INDEX idx_physical_copies_condition ON physical_copies(current_condition);
CREATE INDEX idx_physical_copies_location ON physical_copies(location);
CREATE INDEX idx_physical_copies_book_id ON physical_copies(book_id);
CREATE INDEX idx_physical_copies_barcode ON physical_copies(barcode);
CREATE INDEX idx_physical_copies_archived ON physical_copies(is_archived);
```

### **Query Optimization:**
- Sử dụng pagination cho tất cả danh sách
- Eager loading cho relations (book)
- Efficient filtering và sorting

## 🔄 Tích hợp với Module khác

### **BooksModule:**
- Kiểm tra sách tồn tại khi tạo bản sao
- Lấy thông tin sách cho hiển thị
- Validate book_type là physical

### **BorrowRecordsModule:**
- Cập nhật trạng thái khi mượn/trả
- Kiểm tra bản sao sẵn sàng cho mượn

### **ReservationsModule:**
- Kiểm tra bản sao sẵn sàng khi thực hiện đặt trước
- Cập nhật trạng thái khi có đặt trước

## 🚀 Tính năng Nâng cao

### **1. Quản lý vị trí:**
- Tracking vị trí chi tiết trong thư viện
- Tối ưu hóa không gian lưu trữ
- Hỗ trợ tìm kiếm theo vị trí

### **2. Quản lý tình trạng:**
- Theo dõi tình trạng vật lý của bản sao
- Lịch sử kiểm tra và bảo trì
- Ảnh hưởng đến khả năng mượn

### **3. Tạo hàng loạt:**
- Tạo nhiều bản sao cùng lúc
- Tự động tạo barcode unique
- Tối ưu hóa quy trình nhập sách

### **4. Lưu trữ thông minh:**
- Lưu trữ bản sao không sử dụng
- Tự động chuyển trạng thái
- Tiết kiệm không gian lưu trữ

## 📝 Validation Rules

### **CreatePhysicalCopyDto:**
- `book_id`: UUID hợp lệ, bắt buộc
- `barcode`: Chuỗi unique, tối đa 50 ký tự, bắt buộc
- `purchase_date`: Định dạng ngày hợp lệ, bắt buộc
- `purchase_price`: Số thập phân > 0, bắt buộc
- `location`: Chuỗi, tối đa 100 ký tự, bắt buộc
- `current_condition`: Enum CopyCondition, tùy chọn
- `condition_details`: Tối đa 500 ký tự, tùy chọn
- `notes`: Tối đa 500 ký tự, tùy chọn

### **UpdatePhysicalCopyDto:**
- Kế thừa tất cả rules từ CreatePhysicalCopyDto
- Tất cả fields đều tùy chọn

## 🔧 Monitoring và Logging

### **Key Metrics:**
- Số lượng bản sao theo trạng thái
- Tỷ lệ bản sao hư hỏng/mất
- Hiệu quả sử dụng không gian lưu trữ
- Giá trị tổng bản sao

### **Error Tracking:**
- Lỗi validation barcode duplicate
- Lỗi tạo bản sao cho sách không phải physical
- Lỗi cập nhật trạng thái không hợp lệ

## 🚀 Roadmap

### **Phase 1 - Core Features:**
- ✅ CRUD operations
- ✅ Status management
- ✅ Search và filtering
- ✅ Statistics

### **Phase 2 - Advanced Features:**
- 📋 Barcode scanning integration
- 📋 Location management system
- 📋 Maintenance scheduling
- 📋 Inventory tracking

### **Phase 3 - Enterprise Features:**
- 📋 Multi-library support
- 📋 Advanced analytics
- 📋 Integration với external systems
- 📋 Mobile app support

## 📞 Hỗ trợ

**Module Version**: 2.0
**Last Updated**: 2024-01-01
**Dependencies**: BooksModule

**Access Points:**
- Swagger UI: `/api#/Physical Copies`
- Base URL: `/physical-copies`

**Performance Targets:**
- Search Response: < 200ms
- Create Copy: < 500ms
- Statistics Generation: < 1s
- Concurrent Operations: 100+
