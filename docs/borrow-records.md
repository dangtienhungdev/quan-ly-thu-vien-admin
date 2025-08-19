# Module Quản lý Mượn Sách (Borrow Records)

## 📑 Tổng quan

Module Quản lý Mượn Sách cung cấp các API để quản lý toàn bộ quy trình mượn và trả sách trong hệ thống thư viện. Module này hỗ trợ đầy đủ các tính năng từ tạo bản ghi mượn sách, trả sách, gia hạn đến thống kê chi tiết.

## 🔒 Yêu cầu xác thực

- **JWT Authentication**: Tất cả API yêu cầu JWT token hợp lệ
- **Role Required**:
  - Admin: Có quyền truy cập tất cả endpoints
  - Reader: Chỉ có quyền xem thông tin mượn sách của mình
- **Header**: Gửi kèm Bearer token trong header
  ```
  Authorization: Bearer <your_jwt_token>
  ```

## 🔑 Quyền hạn

- ✅ **ADMIN**: Có quyền truy cập tất cả các endpoints
- ✅ **READER**: Chỉ có quyền xem thông tin mượn sách của mình
- ❌ **Khách**: Không có quyền truy cập

## 📋 Danh sách API Endpoints

### 1. Tạo Bản Ghi Mượn Sách

```http
POST /borrow-records
```

- **Mô tả**: Tạo bản ghi mượn sách mới (chỉ Admin)
- **Body**: CreateBorrowRecordDto
- **Response**: 201 - Thông tin bản ghi mượn sách đã tạo
- **Lỗi**:
  - 400: Dữ liệu không hợp lệ
  - 403: Không có quyền truy cập

### 2. Lấy Danh Sách Bản Ghi Mượn Sách

```http
GET /borrow-records
```

- **Mô tả**: Lấy danh sách bản ghi mượn sách có phân trang
- **Query Parameters**:
  - page: Số trang (mặc định: 1)
  - limit: Số lượng mỗi trang (mặc định: 10)
- **Response**: 200 - Danh sách bản ghi mượn sách và thông tin phân trang

### 3. Tìm Kiếm Bản Ghi Mượn Sách

```http
GET /borrow-records/search
```

- **Mô tả**: Tìm kiếm bản ghi mượn sách theo nhiều tiêu chí
- **Query Parameters**:
  - q: Từ khóa tìm kiếm (tên độc giả, barcode sách, ghi chú)
  - page: Số trang (mặc định: 1)
  - limit: Số lượng mỗi trang (mặc định: 10)
- **Response**: 200 - Kết quả tìm kiếm có phân trang

### 4. Lấy Danh Sách Theo Trạng Thái

```http
GET /borrow-records/status/:status
```

- **Mô tả**: Lấy danh sách bản ghi mượn sách theo trạng thái
- **Parameters**:
  - status: Trạng thái (borrowed, returned, overdue, renewed)
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách bản ghi mượn sách theo trạng thái

### 5. Lấy Danh Sách Theo Độc Giả

```http
GET /borrow-records/reader/:readerId
```

- **Mô tả**: Lấy danh sách bản ghi mượn sách theo độc giả
- **Parameters**:
  - readerId: UUID của độc giả
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách bản ghi mượn sách theo độc giả

### 6. Lấy Danh Sách Sách Mượn Quá Hạn

```http
GET /borrow-records/overdue
```

- **Mô tả**: Lấy danh sách sách mượn quá hạn
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách sách mượn quá hạn

### 7. Lấy Danh Sách Yêu Cầu Chờ Phê Duyệt

```http
GET /borrow-records/pending-approval
```

- **Mô tả**: Lấy danh sách yêu cầu mượn sách đang chờ phê duyệt
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách yêu cầu chờ phê duyệt

### 8. Lấy Thống Kê Mượn Sách

```http
GET /borrow-records/stats
```

- **Mô tả**: Lấy thống kê tổng quan về mượn sách
- **Response**: 200 - Thống kê chi tiết
  ```json
  {
  	"total": 150,
  	"borrowed": 45,
  	"returned": 95,
  	"overdue": 8,
  	"renewed": 2,
  	"byMonth": [
  		{ "month": "2024-01", "count": 25 },
  		{ "month": "2024-02", "count": 30 }
  	]
  }
  ```

### 8. Lấy Thông Tin Bản Ghi Mượn Sách

```http
GET /borrow-records/:id
```

- **Mô tả**: Lấy thông tin chi tiết bản ghi mượn sách theo ID
- **Response**: 200 - Thông tin chi tiết bản ghi mượn sách
- **Lỗi**: 404 - Không tìm thấy bản ghi mượn sách

### 9. Cập Nhật Bản Ghi Mượn Sách

```http
PATCH /borrow-records/:id
```

- **Mô tả**: Cập nhật thông tin bản ghi mượn sách theo ID (chỉ Admin)
- **Body**: UpdateBorrowRecordDto
- **Response**: 200 - Thông tin bản ghi mượn sách đã cập nhật
- **Lỗi**:
  - 404: Không tìm thấy bản ghi mượn sách
  - 400: Dữ liệu không hợp lệ
  - 403: Không có quyền truy cập

### 10. Phê Duyệt Yêu Cầu Mượn Sách

```http
PATCH /borrow-records/:id/approve
```

- **Mô tả**: Phê duyệt yêu cầu mượn sách (chỉ Admin)
- **Body**: { librarianId: string, notes?: string }
- **Response**: 200 - Thông tin bản ghi sau khi phê duyệt
- **Lỗi**:
  - 400: Yêu cầu không ở trạng thái chờ phê duyệt
  - 404: Không tìm thấy bản ghi mượn sách
  - 403: Không có quyền truy cập

### 11. Từ Chối Yêu Cầu Mượn Sách

```http
PATCH /borrow-records/:id/reject
```

- **Mô tả**: Từ chối yêu cầu mượn sách (chỉ Admin)
- **Body**: { librarianId: string, reason: string }
- **Response**: 200 - Thông tin bản ghi sau khi từ chối
- **Lỗi**:
  - 400: Yêu cầu không ở trạng thái chờ phê duyệt
  - 404: Không tìm thấy bản ghi mượn sách
  - 403: Không có quyền truy cập

### 12. Trả Sách

```http
PATCH /borrow-records/:id/return
```

- **Mô tả**: Trả sách (chỉ Admin)
- **Body**: { returnNotes?: string }
- **Response**: 200 - Thông tin bản ghi sau khi trả sách
- **Lỗi**:
  - 400: Sách đã được trả trước đó
  - 404: Không tìm thấy bản ghi mượn sách
  - 403: Không có quyền truy cập

### 13. Gia Hạn Sách

```http
PATCH /borrow-records/:id/renew
```

- **Mô tả**: Gia hạn sách (chỉ Admin)
- **Body**: { newDueDate: string }
- **Response**: 200 - Thông tin bản ghi sau khi gia hạn
- **Lỗi**:
  - 400: Không thể gia hạn sách này
  - 404: Không tìm thấy bản ghi mượn sách
  - 403: Không có quyền truy cập

### 14. Xóa Bản Ghi Mượn Sách

```http
DELETE /borrow-records/:id
```

- **Mô tả**: Xóa bản ghi mượn sách khỏi hệ thống theo ID (chỉ Admin)
- **Response**: 204 - Xóa thành công
- **Lỗi**:
  - 404: Không tìm thấy bản ghi mượn sách
  - 403: Không có quyền truy cập

## 📝 Validation Rules

### CreateBorrowRecordDto

- **reader_id**: Bắt buộc, UUID hợp lệ
- **copy_id**: Bắt buộc, UUID hợp lệ
- **borrow_date**: Bắt buộc, định dạng ngày hợp lệ
- **due_date**: Bắt buộc, định dạng ngày hợp lệ
- **return_date**: Tùy chọn, định dạng ngày hợp lệ
- **status**: Tùy chọn, enum BorrowStatus (mặc định: borrowed)
- **librarian_id**: Bắt buộc, UUID hợp lệ
- **borrow_notes**: Tùy chọn, chuỗi, tối đa 1000 ký tự
- **return_notes**: Tùy chọn, chuỗi, tối đa 1000 ký tự
- **renewal_count**: Tùy chọn, số nguyên từ 0-10 (mặc định: 0)

### UpdateBorrowRecordDto

- Tất cả trường là không bắt buộc
- Các quy tắc validation giống CreateBorrowRecordDto

## 🎯 Business Rules

1. **Tạo Bản Ghi Mượn Sách**

   - Tự động tạo ngày mượn và ngày hạn
   - Mặc định trạng thái 'pending_approval'
   - Số lần gia hạn mặc định là 0

2. **Trả Sách**

   - Chỉ có thể trả sách đang được mượn
   - Tự động cập nhật ngày trả và trạng thái
   - Có thể thêm ghi chú khi trả sách

3. **Gia Hạn Sách**

   - Chỉ có thể gia hạn sách đang được mượn
   - Giới hạn tối đa 3 lần gia hạn
   - Tự động cập nhật số lần gia hạn

4. **Quản Lý Trạng Thái**

   - pending_approval: Chờ phê duyệt
   - borrowed: Đang mượn
   - returned: Đã trả
   - overdue: Quá hạn
   - renewed: Đã gia hạn

5. **Quy Trình Phê Duyệt**

   - Yêu cầu mượn sách mới tạo có trạng thái 'pending_approval'
   - Admin có thể phê duyệt hoặc từ chối yêu cầu
   - Khi phê duyệt: chuyển sang trạng thái 'borrowed'
   - Khi từ chối: chuyển sang trạng thái 'returned' với ghi chú lý do từ chối

6. **Tự Động Cập Nhật Quá Hạn**
   - Hệ thống tự động cập nhật trạng thái quá hạn
   - Dựa trên ngày hạn và trạng thái hiện tại

## 📊 Monitoring

- Theo dõi số lượng sách đang mượn, đã trả, quá hạn
- Thống kê mượn sách theo tháng
- Monitoring hiệu suất tìm kiếm
- Theo dõi hoạt động mượn/trả sách

## 🔍 Tính năng Tìm kiếm

### Tìm kiếm cơ bản

- Tìm theo tên độc giả
- Tìm theo barcode sách
- Tìm theo tên sách
- Tìm theo ghi chú mượn/trả sách

### Lọc dữ liệu

- Lọc theo trạng thái mượn sách
- Lọc theo độc giả
- Lọc sách quá hạn
- Sắp xếp theo ngày tạo (mới nhất)

## 🚀 Tối ưu hóa

### Database Indexes

- Index trên reader_id để tìm kiếm theo độc giả
- Index trên copy_id để tìm kiếm theo sách
- Index trên status để lọc trạng thái
- Index trên due_date để tìm sách quá hạn
- Index trên created_at để sắp xếp

### Performance Tips

- Sử dụng pagination cho tất cả danh sách
- Cache thống kê để giảm tải database
- Optimize query với proper indexing
- Sử dụng relations để load dữ liệu liên quan

## 📈 Tương lai

### Tính năng mở rộng

- Tích hợp với hệ thống phạt tự động
- Notification system cho sách quá hạn
- Báo cáo chi tiết theo thời gian
- Tích hợp với module Reservations

### Tích hợp

- Kết nối với module Readers
- Kết nối với module Physical Copies
- Kết nối với module Users (librarian)
- Báo cáo thống kê nâng cao
- Audit trail cho các thay đổi

## 🔧 Tính năng Đặc biệt

### Tự động cập nhật trạng thái quá hạn

```typescript
// Method có sẵn trong service
await borrowRecordsService.updateOverdueStatus();
```

### Thống kê theo tháng

- Tự động tính toán thống kê 6 tháng gần nhất
- Phân tích xu hướng mượn sách

### Validation nghiêm ngặt

- Kiểm tra UUID hợp lệ
- Validation ngày tháng
- Giới hạn số lần gia hạn
- Kiểm tra trạng thái trước khi thực hiện hành động

### Thông tin sách đầy đủ

- Tất cả API trả về thông tin sách chi tiết trong physicalCopy
- Bao gồm tên sách, tác giả, ISBN và các thông tin khác
- Tìm kiếm theo tên sách được hỗ trợ
- Dữ liệu được load tự động qua relations

## 📞 Hỗ trợ & Bảo trì

**Tính năng chính đã triển khai:**

1. ✅ CRUD operations cho bản ghi mượn sách
2. ✅ Quản lý trạng thái mượn sách
3. ✅ Chức năng trả sách và gia hạn
4. ✅ Tìm kiếm và lọc dữ liệu
5. ✅ Thống kê chi tiết
6. ✅ Swagger documentation tiếng Việt
7. ✅ Role-based access control
8. ✅ Phân trang cho tất cả danh sách
9. ✅ Validation đầy đủ cho tất cả endpoints
10. ✅ Error handling chi tiết

**Access Points:**

- Swagger UI: `http://localhost:8000/api`
- Base URL: `/borrow-records`
- Authentication: JWT Bearer Token

**Hướng dẫn sử dụng:**

- Tạo bản ghi mượn sách: POST /borrow-records
- Trả sách: PATCH /borrow-records/:id/return
- Gia hạn sách: PATCH /borrow-records/:id/renew
- Xem thống kê: GET /borrow-records/stats
- Tìm kiếm: GET /borrow-records/search?q=keyword
- Lọc theo trạng thái: GET /borrow-records/status/borrowed
- Lọc theo độc giả: GET /borrow-records/reader/:readerId
- Xem sách quá hạn: GET /borrow-records/overdue

## 🔄 Cập nhật gần đây

**Phiên bản hiện tại:**

- ✅ Tất cả 12 endpoints đã được triển khai đầy đủ
- ✅ Swagger documentation hoàn chỉnh cho tất cả endpoints
- ✅ Role-based access control cho từng endpoint
- ✅ Validation và error handling chi tiết
- ✅ Phân trang cho tất cả danh sách
- ✅ Tìm kiếm và lọc dữ liệu nâng cao
- ✅ Thống kê chi tiết với dữ liệu theo tháng
- ✅ Thông tin sách đầy đủ trong tất cả API responses
