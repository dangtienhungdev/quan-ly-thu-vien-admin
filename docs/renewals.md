# Module Quản lý Gia Hạn Sách (Renewals)

## 📑 Tổng quan

Module Quản lý Gia Hạn Sách cung cấp các API để quản lý toàn bộ quy trình gia hạn sách trong hệ thống thư viện. Module này hỗ trợ đầy đủ các tính năng từ tạo yêu cầu gia hạn, phê duyệt, từ chối đến thống kê chi tiết.

## 🔒 Yêu cầu xác thực

- **JWT Authentication**: Tất cả API yêu cầu JWT token hợp lệ
- **Role Required**:
  - Admin: Có quyền truy cập tất cả endpoints
  - Reader: Chỉ có quyền xem thông tin gia hạn sách của mình
- **Header**: Gửi kèm Bearer token trong header
  ```
  Authorization: Bearer <your_jwt_token>
  ```

## 🔑 Quyền hạn

- ✅ **ADMIN**: Có quyền truy cập tất cả các endpoints
- ✅ **READER**: Chỉ có quyền xem thông tin gia hạn sách của mình
- ❌ **Khách**: Không có quyền truy cập

## 📋 Danh sách API Endpoints

### 1. Tạo Bản Ghi Gia Hạn Sách
```http
POST /renewals
```
- **Mô tả**: Tạo bản ghi gia hạn sách mới (chỉ Admin)
- **Body**: CreateRenewalDto
- **Response**: 201 - Thông tin bản ghi gia hạn sách đã tạo
- **Lỗi**:
  - 400: Dữ liệu không hợp lệ hoặc không thể gia hạn
  - 403: Không có quyền truy cập

### 2. Lấy Danh Sách Bản Ghi Gia Hạn Sách
```http
GET /renewals
```
- **Mô tả**: Lấy danh sách bản ghi gia hạn sách có phân trang
- **Query Parameters**:
  - page: Số trang (mặc định: 1)
  - limit: Số lượng mỗi trang (mặc định: 10)
- **Response**: 200 - Danh sách bản ghi gia hạn sách và thông tin phân trang

### 3. Tìm Kiếm Bản Ghi Gia Hạn Sách
```http
GET /renewals/search
```
- **Mô tả**: Tìm kiếm bản ghi gia hạn sách theo nhiều tiêu chí
- **Query Parameters**:
  - q: Từ khóa tìm kiếm (lý do gia hạn, ghi chú thủ thư, ID bản ghi mượn)
  - page: Số trang (mặc định: 1)
  - limit: Số lượng mỗi trang (mặc định: 10)
- **Response**: 200 - Kết quả tìm kiếm có phân trang

### 4. Lấy Danh Sách Theo Trạng Thái
```http
GET /renewals/status/:status
```
- **Mô tả**: Lấy danh sách bản ghi gia hạn sách theo trạng thái
- **Parameters**:
  - status: Trạng thái (approved, pending, rejected)
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách bản ghi gia hạn sách theo trạng thái

### 5. Lấy Danh Sách Theo Bản Ghi Mượn Sách
```http
GET /renewals/borrow/:borrowId
```
- **Mô tả**: Lấy danh sách bản ghi gia hạn sách theo bản ghi mượn sách
- **Parameters**:
  - borrowId: UUID của bản ghi mượn sách
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách bản ghi gia hạn sách theo bản ghi mượn sách

### 6. Lấy Danh Sách Theo Thủ Thư
```http
GET /renewals/librarian/:librarianId
```
- **Mô tả**: Lấy danh sách bản ghi gia hạn sách theo thủ thư
- **Parameters**:
  - librarianId: UUID của thủ thư
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách bản ghi gia hạn sách theo thủ thư

### 7. Lấy Thống Kê Gia Hạn Sách
```http
GET /renewals/stats
```
- **Mô tả**: Lấy thống kê tổng quan về gia hạn sách
- **Response**: 200 - Thống kê chi tiết
  ```json
  {
    "total": 50,
    "approved": 35,
    "pending": 10,
    "rejected": 5,
    "byMonth": [
      {"month": "2024-01", "count": 15},
      {"month": "2024-02", "count": 20}
    ]
  }
  ```

### 8. Lấy Thông Tin Bản Ghi Gia Hạn Sách
```http
GET /renewals/:id
```
- **Mô tả**: Lấy thông tin chi tiết bản ghi gia hạn sách theo ID
- **Response**: 200 - Thông tin chi tiết bản ghi gia hạn sách
- **Lỗi**: 404 - Không tìm thấy bản ghi gia hạn sách

### 9. Cập Nhật Bản Ghi Gia Hạn Sách
```http
PATCH /renewals/:id
```
- **Mô tả**: Cập nhật thông tin bản ghi gia hạn sách theo ID (chỉ Admin)
- **Body**: UpdateRenewalDto
- **Response**: 200 - Thông tin bản ghi gia hạn sách đã cập nhật
- **Lỗi**:
  - 404: Không tìm thấy bản ghi gia hạn sách
  - 400: Dữ liệu không hợp lệ
  - 403: Không có quyền truy cập

### 10. Phê Duyệt Gia Hạn Sách
```http
PATCH /renewals/:id/approve
```
- **Mô tả**: Phê duyệt gia hạn sách (chỉ Admin)
- **Body**: { librarianNotes?: string }
- **Response**: 200 - Thông tin bản ghi sau khi phê duyệt
- **Lỗi**:
  - 400: Không thể phê duyệt gia hạn này
  - 404: Không tìm thấy bản ghi gia hạn sách
  - 403: Không có quyền truy cập

### 11. Từ Chối Gia Hạn Sách
```http
PATCH /renewals/:id/reject
```
- **Mô tả**: Từ chối gia hạn sách (chỉ Admin)
- **Body**: { librarianNotes?: string }
- **Response**: 200 - Thông tin bản ghi sau khi từ chối
- **Lỗi**:
  - 400: Không thể từ chối gia hạn này
  - 404: Không tìm thấy bản ghi gia hạn sách
  - 403: Không có quyền truy cập

### 12. Xóa Bản Ghi Gia Hạn Sách
```http
DELETE /renewals/:id
```
- **Mô tả**: Xóa bản ghi gia hạn sách khỏi hệ thống theo ID (chỉ Admin)
- **Response**: 204 - Xóa thành công
- **Lỗi**:
  - 404: Không tìm thấy bản ghi gia hạn sách
  - 403: Không có quyền truy cập

## 📝 Validation Rules

### CreateRenewalDto
- **borrow_id**: Bắt buộc, UUID hợp lệ
- **renewal_date**: Bắt buộc, định dạng ngày hợp lệ
- **new_due_date**: Bắt buộc, định dạng ngày hợp lệ
- **librarian_id**: Bắt buộc, UUID hợp lệ
- **reason**: Tùy chọn, chuỗi, tối đa 1000 ký tự
- **librarian_notes**: Tùy chọn, chuỗi, tối đa 1000 ký tự
- **renewal_number**: Bắt buộc, số nguyên từ 1-10
- **status**: Tùy chọn, enum ['approved', 'pending', 'rejected'] (mặc định: approved)

### UpdateRenewalDto
- Tất cả trường là không bắt buộc
- Các quy tắc validation giống CreateRenewalDto

## 🎯 Business Rules

1. **Tạo Bản Ghi Gia Hạn Sách**
   - Chỉ có thể gia hạn sách đang được mượn (borrowed hoặc renewed)
   - Kiểm tra giới hạn số lần gia hạn (tối đa 3 lần)
   - Ngày hạn mới phải sau ngày hạn hiện tại
   - Tự động cập nhật bản ghi mượn sách nếu được phê duyệt

2. **Phê Duyệt Gia Hạn**
   - Chỉ có thể phê duyệt gia hạn đang chờ (pending)
   - Không thể phê duyệt gia hạn đã bị từ chối
   - Tự động cập nhật ngày hạn và trạng thái bản ghi mượn sách

3. **Từ Chối Gia Hạn**
   - Chỉ có thể từ chối gia hạn đang chờ (pending)
   - Không thể từ chối gia hạn đã được phê duyệt
   - Có thể thêm ghi chú lý do từ chối

4. **Quản Lý Trạng Thái**
   - pending: Đang chờ phê duyệt
   - approved: Đã được phê duyệt
   - rejected: Bị từ chối

5. **Tích Hợp Với BorrowRecords**
   - Tự động cập nhật bản ghi mượn sách khi phê duyệt
   - Đồng bộ số lần gia hạn
   - Cập nhật ngày hạn mới

## 📊 Monitoring

- Theo dõi số lượng gia hạn đã phê duyệt, đang chờ, bị từ chối
- Thống kê gia hạn sách theo tháng
- Monitoring hiệu suất tìm kiếm
- Theo dõi hoạt động phê duyệt/từ chối gia hạn

## 🔍 Tính năng Tìm kiếm

### Tìm kiếm cơ bản
- Tìm theo lý do gia hạn
- Tìm theo ghi chú thủ thư
- Tìm theo ID bản ghi mượn sách

### Lọc dữ liệu
- Lọc theo trạng thái gia hạn
- Lọc theo bản ghi mượn sách
- Lọc theo thủ thư
- Sắp xếp theo ngày tạo (mới nhất)

## 🚀 Tối ưu hóa

### Database Indexes
- Index trên borrow_id để tìm kiếm theo bản ghi mượn sách
- Index trên librarian_id để tìm kiếm theo thủ thư
- Index trên status để lọc trạng thái
- Index trên renewal_date để sắp xếp theo ngày gia hạn
- Index trên created_at để sắp xếp

### Performance Tips
- Sử dụng pagination cho tất cả danh sách
- Cache thống kê để giảm tải database
- Optimize query với proper indexing
- Sử dụng relations để load dữ liệu liên quan

## 📈 Tương lai

### Tính năng mở rộng
- Tích hợp với hệ thống notification
- Workflow approval tự động
- Báo cáo chi tiết theo thời gian
- Tích hợp với module Reservations

### Tích hợp
- Kết nối với module BorrowRecords
- Kết nối với module Users (librarian)
- Báo cáo thống kê nâng cao
- Audit trail cho các thay đổi

## 🔧 Tính năng Đặc biệt

### Tự động cập nhật bản ghi mượn sách
```typescript
// Khi phê duyệt gia hạn, tự động cập nhật:
// - Ngày hạn mới
// - Trạng thái thành 'renewed'
// - Số lần gia hạn + 1
```

### Validation nghiêm ngặt
- Kiểm tra UUID hợp lệ
- Validation ngày tháng
- Kiểm tra trạng thái bản ghi mượn sách
- Giới hạn số lần gia hạn

### Thống kê theo tháng
- Tự động tính toán thống kê 6 tháng gần nhất
- Phân tích xu hướng gia hạn sách

## 📞 Hỗ trợ & Bảo trì

**Tính năng chính đã triển khai:**
1. ✅ CRUD operations cho bản ghi gia hạn sách
2. ✅ Quản lý trạng thái gia hạn sách
3. ✅ Chức năng phê duyệt và từ chối
4. ✅ Tìm kiếm và lọc dữ liệu
5. ✅ Thống kê chi tiết
6. ✅ Tích hợp với BorrowRecords
7. ✅ Swagger documentation tiếng Việt
8. ✅ Role-based access control

**Access Points:**
- Swagger UI: `http://localhost:8000/api`
- Base URL: `/renewals`
- Authentication: JWT Bearer Token

**Hướng dẫn sử dụng:**
- Tạo bản ghi gia hạn: POST /renewals
- Phê duyệt gia hạn: PATCH /renewals/:id/approve
- Từ chối gia hạn: PATCH /renewals/:id/reject
- Xem thống kê: GET /renewals/stats