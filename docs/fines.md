# Module Quản lý Phạt (Fines)

## 📑 Tổng quan

Module Quản lý Phạt cung cấp các API để quản lý toàn bộ quy trình phạt trong hệ thống thư viện. Module này hỗ trợ đầy đủ các tính năng từ tạo phạt tự động, thanh toán, miễn phạt đến thống kê chi tiết.

## 🔒 Yêu cầu xác thực

- **JWT Authentication**: Tất cả API yêu cầu JWT token hợp lệ
- **Role Required**:
  - Admin: Có quyền truy cập tất cả endpoints
  - Reader: Chỉ có quyền xem thông tin phạt của mình
- **Header**: Gửi kèm Bearer token trong header
  ```
  Authorization: Bearer <your_jwt_token>
  ```

## 🔑 Quyền hạn

- ✅ **ADMIN**: Có quyền truy cập tất cả các endpoints
- ✅ **READER**: Chỉ có quyền xem thông tin phạt của mình
- ❌ **Khách**: Không có quyền truy cập

## 📋 Danh sách API Endpoints

### 1. Tạo Bản Ghi Phạt
```http
POST /fines
```
- **Mô tả**: Tạo bản ghi phạt mới (chỉ Admin)
- **Body**: CreateFineDto
- **Response**: 201 - Thông tin bản ghi phạt đã tạo
- **Lỗi**:
  - 400: Dữ liệu không hợp lệ
  - 403: Không có quyền truy cập

### 2. Tạo Phạt Tự Động Cho Sách Trễ Hạn
```http
POST /fines/overdue/:borrowId
```
- **Mô tả**: Tạo phạt tự động cho sách trễ hạn (chỉ Admin)
- **Parameters**: borrowId - UUID của bản ghi mượn sách
- **Body**: { overdueDays: number, dailyRate?: number }
- **Response**: 201 - Thông tin phạt trễ hạn đã tạo
- **Lỗi**:
  - 400: Đã có phạt trễ hạn cho bản ghi này
  - 403: Không có quyền truy cập

### 3. Lấy Danh Sách Bản Ghi Phạt
```http
GET /fines
```
- **Mô tả**: Lấy danh sách bản ghi phạt có phân trang
- **Query Parameters**:
  - page: Số trang (mặc định: 1)
  - limit: Số lượng mỗi trang (mặc định: 10)
- **Response**: 200 - Danh sách bản ghi phạt và thông tin phân trang

### 4. Tìm Kiếm Bản Ghi Phạt
```http
GET /fines/search
```
- **Mô tả**: Tìm kiếm bản ghi phạt theo nhiều tiêu chí
- **Query Parameters**:
  - q: Từ khóa tìm kiếm (mô tả, ghi chú, mã giao dịch)
  - page: Số trang (mặc định: 1)
  - limit: Số lượng mỗi trang (mặc định: 10)
- **Response**: 200 - Kết quả tìm kiếm có phân trang

### 5. Lấy Danh Sách Theo Trạng Thái
```http
GET /fines/status/:status
```
- **Mô tả**: Lấy danh sách bản ghi phạt theo trạng thái
- **Parameters**:
  - status: Trạng thái (unpaid, paid, partially_paid, waived)
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách bản ghi phạt theo trạng thái

### 6. Lấy Danh Sách Theo Loại
```http
GET /fines/type/:type
```
- **Mô tả**: Lấy danh sách bản ghi phạt theo loại
- **Parameters**:
  - type: Loại phạt (overdue, damage, lost, administrative)
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách bản ghi phạt theo loại

### 7. Lấy Danh Sách Theo Bản Ghi Mượn Sách
```http
GET /fines/borrow/:borrowId
```
- **Mô tả**: Lấy danh sách bản ghi phạt theo bản ghi mượn sách
- **Parameters**:
  - borrowId: UUID của bản ghi mượn sách
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách bản ghi phạt theo bản ghi mượn sách

### 8. Lấy Danh Sách Phạt Quá Hạn Thanh Toán
```http
GET /fines/overdue
```
- **Mô tả**: Lấy danh sách phạt quá hạn thanh toán
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách phạt quá hạn thanh toán

### 9. Lấy Thống Kê Phạt
```http
GET /fines/stats
```
- **Mô tả**: Lấy thống kê tổng quan về phạt
- **Response**: 200 - Thống kê chi tiết
  ```json
  {
    "total": 100,
    "unpaid": 30,
    "paid": 60,
    "partially_paid": 5,
    "waived": 5,
    "totalAmount": 5000000,
    "totalPaid": 3000000,
    "totalUnpaid": 2000000,
    "byType": [
      {"type": "overdue", "count": 80, "amount": 4000000},
      {"type": "damage", "count": 20, "amount": 1000000}
    ],
    "byMonth": [
      {"month": "2024-01", "count": 50, "amount": 2500000},
      {"month": "2024-02", "count": 50, "amount": 2500000}
    ]
  }
  ```

### 10. Lấy Thông Tin Bản Ghi Phạt
```http
GET /fines/:id
```
- **Mô tả**: Lấy thông tin chi tiết bản ghi phạt theo ID
- **Response**: 200 - Thông tin chi tiết bản ghi phạt
- **Lỗi**: 404 - Không tìm thấy bản ghi phạt

### 11. Cập Nhật Bản Ghi Phạt
```http
PATCH /fines/:id
```
- **Mô tả**: Cập nhật thông tin bản ghi phạt theo ID (chỉ Admin)
- **Body**: UpdateFineDto
- **Response**: 200 - Thông tin bản ghi phạt đã cập nhật
- **Lỗi**:
  - 404: Không tìm thấy bản ghi phạt
  - 400: Dữ liệu không hợp lệ
  - 403: Không có quyền truy cập

### 12. Thanh Toán Phạt
```http
PATCH /fines/:id/pay
```
- **Mô tả**: Thanh toán phạt (chỉ Admin)
- **Body**: { amount: number, paymentMethod: string, transactionId?: string }
- **Response**: 200 - Thông tin bản ghi sau khi thanh toán
- **Lỗi**:
  - 400: Không thể thanh toán phạt này
  - 404: Không tìm thấy bản ghi phạt
  - 403: Không có quyền truy cập

### 13. Miễn Phạt
```http
PATCH /fines/:id/waive
```
- **Mô tả**: Miễn phạt (chỉ Admin)
- **Body**: { librarianNotes?: string }
- **Response**: 200 - Thông tin bản ghi sau khi miễn phạt
- **Lỗi**:
  - 400: Không thể miễn phạt này
  - 404: Không tìm thấy bản ghi phạt
  - 403: Không có quyền truy cập

### 14. Xóa Bản Ghi Phạt
```http
DELETE /fines/:id
```
- **Mô tả**: Xóa bản ghi phạt khỏi hệ thống theo ID (chỉ Admin)
- **Response**: 204 - Xóa thành công
- **Lỗi**:
  - 404: Không tìm thấy bản ghi phạt
  - 403: Không có quyền truy cập

## 📝 Validation Rules

### CreateFineDto
- **borrow_id**: Bắt buộc, UUID hợp lệ
- **fine_amount**: Bắt buộc, số dương
- **paid_amount**: Tùy chọn, số không âm, không được lớn hơn fine_amount
- **fine_date**: Bắt buộc, định dạng ngày hợp lệ
- **payment_date**: Tùy chọn, định dạng ngày hợp lệ
- **reason**: Bắt buộc, enum FineType
- **description**: Tùy chọn, chuỗi, tối đa 1000 ký tự
- **status**: Tùy chọn, enum FineStatus (tự động tính toán)
- **overdue_days**: Tùy chọn, số nguyên từ 0-365
- **daily_rate**: Tùy chọn, số dương
- **librarian_notes**: Tùy chọn, chuỗi, tối đa 1000 ký tự
- **reader_notes**: Tùy chọn, chuỗi, tối đa 1000 ký tự
- **due_date**: Tùy chọn, định dạng ngày hợp lệ
- **payment_method**: Tùy chọn, enum ['cash', 'card', 'bank_transfer', 'online']
- **transaction_id**: Tùy chọn, chuỗi, tối đa 100 ký tự

### UpdateFineDto
- Tất cả trường là không bắt buộc
- Các quy tắc validation giống CreateFineDto

## 🎯 Business Rules

1. **Tạo Bản Ghi Phạt**
   - Kiểm tra bản ghi mượn sách có tồn tại không
   - Số tiền đã thanh toán không được lớn hơn số tiền phạt
   - Tự động tính toán trạng thái dựa trên số tiền đã thanh toán

2. **Tạo Phạt Tự Động Trễ Hạn**
   - Kiểm tra chưa có phạt trễ hạn cho bản ghi mượn sách
   - Tự động tính số tiền phạt = số ngày trễ × mức phạt mỗi ngày
   - Tự động set hạn thanh toán 30 ngày

3. **Thanh Toán Phạt**
   - Chỉ có thể thanh toán phạt chưa thanh toán đầy đủ
   - Không thể thanh toán phạt đã được miễn
   - Số tiền thanh toán không được vượt quá số tiền phạt còn lại
   - Tự động cập nhật trạng thái sau khi thanh toán

4. **Miễn Phạt**
   - Chỉ có thể miễn phạt chưa thanh toán đầy đủ
   - Không thể miễn phạt đã thanh toán
   - Có thể thêm ghi chú lý do miễn phạt

5. **Quản Lý Trạng Thái**
   - unpaid: Chưa thanh toán
   - paid: Đã thanh toán đầy đủ
   - partially_paid: Thanh toán một phần
   - waived: Được miễn

6. **Loại Phạt**
   - overdue: Phạt trễ hạn
   - damage: Phạt hư hỏng sách
   - lost: Phạt mất sách
   - administrative: Phạt hành chính

## 📊 Monitoring

- Theo dõi số lượng phạt theo trạng thái
- Thống kê phạt theo loại và theo tháng
- Monitoring phạt quá hạn thanh toán
- Theo dõi tổng thu phạt và tỷ lệ thu hồi

## 🔍 Tính năng Tìm kiếm

### Tìm kiếm cơ bản
- Tìm theo mô tả phạt
- Tìm theo ghi chú thủ thư
- Tìm theo ghi chú độc giả
- Tìm theo mã giao dịch thanh toán

### Lọc dữ liệu
- Lọc theo trạng thái phạt
- Lọc theo loại phạt
- Lọc theo bản ghi mượn sách
- Lọc phạt quá hạn thanh toán
- Sắp xếp theo ngày tạo (mới nhất)

## 🚀 Tối ưu hóa

### Database Indexes
- Index trên borrow_id để tìm kiếm theo bản ghi mượn sách
- Index trên status để lọc trạng thái
- Index trên reason để lọc loại phạt
- Index trên fine_date để sắp xếp theo ngày phạt
- Index trên due_date để tìm phạt quá hạn
- Index trên created_at để sắp xếp

### Performance Tips
- Sử dụng pagination cho tất cả danh sách
- Cache thống kê để giảm tải database
- Optimize query với proper indexing
- Sử dụng relations để load dữ liệu liên quan

## 📈 Tương lai

### Tính năng mở rộng
- Tích hợp với hệ thống payment gateway
- Tự động gửi thông báo phạt
- Workflow approval cho miễn phạt
- Báo cáo chi tiết theo thời gian

### Tích hợp
- Kết nối với module BorrowRecords
- Kết nối với module Users (librarian)
- Báo cáo thống kê nâng cao
- Audit trail cho các thay đổi

## 🔧 Tính năng Đặc biệt

### Tự động tính toán trạng thái
```typescript
// Tự động cập nhật trạng thái dựa trên số tiền đã thanh toán:
// - paid_amount >= fine_amount → PAID
// - paid_amount > 0 → PARTIALLY_PAID
// - paid_amount = 0 → UNPAID
```

### Phạt trễ hạn tự động
```typescript
// Tự động tạo phạt trễ hạn:
// - Tính số tiền = số ngày trễ × mức phạt mỗi ngày
// - Set hạn thanh toán 30 ngày
// - Kiểm tra trùng lặp phạt trễ hạn
```

### Thanh toán linh hoạt
- Hỗ trợ thanh toán từng phần
- Nhiều phương thức thanh toán
- Tracking mã giao dịch
- Tự động cập nhật trạng thái

## 📞 Hỗ trợ & Bảo trì

**Tính năng chính đã triển khai:**
1. ✅ CRUD operations cho bản ghi phạt
2. ✅ Tạo phạt tự động trễ hạn
3. ✅ Quản lý trạng thái phạt
4. ✅ Chức năng thanh toán và miễn phạt
5. ✅ Tìm kiếm và lọc dữ liệu
6. ✅ Thống kê chi tiết
7. ✅ Tích hợp với BorrowRecords
8. ✅ Swagger documentation tiếng Việt
9. ✅ Role-based access control

**Access Points:**
- Swagger UI: `http://localhost:8000/api`
- Base URL: `/fines`
- Authentication: JWT Bearer Token

**Hướng dẫn sử dụng:**
- Tạo phạt: POST /fines
- Tạo phạt trễ hạn: POST /fines/overdue/:borrowId
- Thanh toán phạt: PATCH /fines/:id/pay
- Miễn phạt: PATCH /fines/:id/waive
- Xem thống kê: GET /fines/stats