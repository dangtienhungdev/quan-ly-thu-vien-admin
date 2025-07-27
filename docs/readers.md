# Module Quản lý Độc Giả (Readers)

## 📑 Tổng quan

Module Quản lý Độc Giả cung cấp các API để quản lý thông tin độc giả trong hệ thống thư viện. Module này chỉ dành cho admin sử dụng.

## 🔒 Yêu cầu xác thực

- **JWT Authentication**: Tất cả API yêu cầu JWT token hợp lệ
- **Role Required**: Chỉ user có role `admin` mới có quyền truy cập
- **Header**: Gửi kèm Bearer token trong header
  ```
  Authorization: Bearer <your_jwt_token>
  ```

## 🔑 Quyền hạn

- ✅ Chỉ ADMIN mới có quyền truy cập tất cả các endpoints
- ❌ Độc giả (reader) không có quyền truy cập

## 📋 Danh sách API Endpoints

### 1. Tạo Hồ Sơ Độc Giả Mới
```http
POST /readers
```
- **Mô tả**: Tạo hồ sơ độc giả mới trong hệ thống
- **Body**: CreateReaderDto
- **Response**: 201 - Thông tin độc giả đã tạo
- **Lỗi**:
  - 400: Dữ liệu không hợp lệ
  - 409: Người dùng đã có hồ sơ độc giả hoặc số thẻ đã tồn tại

### 2. Lấy Danh Sách Độc Giả
```http
GET /readers
```
- **Mô tả**: Lấy danh sách độc giả có phân trang
- **Query Parameters**:
  - page: Số trang (mặc định: 1)
  - limit: Số lượng mỗi trang (mặc định: 10)
- **Response**: 200 - Danh sách độc giả và thông tin phân trang

### 3. Tìm Kiếm Độc Giả
```http
GET /readers/search
```
- **Mô tả**: Tìm kiếm độc giả theo nhiều tiêu chí
- **Query Parameters**:
  - q: Từ khóa tìm kiếm (tên, số thẻ, SĐT, username, email)
  - page: Số trang (mặc định: 1)
  - limit: Số lượng mỗi trang (mặc định: 10)
- **Response**: 200 - Kết quả tìm kiếm có phân trang

### 4. Lấy Danh Sách Thẻ Hết Hạn
```http
GET /readers/expired-cards
```
- **Mô tả**: Lấy danh sách độc giả có thẻ đã hết hạn
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách thẻ hết hạn

### 5. Lấy Danh Sách Thẻ Sắp Hết Hạn
```http
GET /readers/expiring-soon
```
- **Mô tả**: Lấy danh sách độc giả có thẻ sắp hết hạn
- **Query Parameters**:
  - days: Số ngày kiểm tra trước (mặc định: 30)
  - page, limit: Thông tin phân trang
- **Response**: 200 - Danh sách thẻ sắp hết hạn

### 6. Tạo Số Thẻ Mới
```http
GET /readers/generate-card-number
```
- **Mô tả**: Tạo số thẻ thư viện mới tự động
- **Response**: 200 - Số thẻ đã tạo

### 7. Lấy Độc Giả Theo Loại
```http
GET /readers/type/:readerTypeId
```
- **Mô tả**: Lấy danh sách độc giả theo loại độc giả
- **Parameters**:
  - readerTypeId: UUID của loại độc giả
- **Query Parameters**: Hỗ trợ phân trang
- **Response**: 200 - Danh sách độc giả theo loại

### 8. Lấy Thông Tin Độc Giả
```http
GET /readers/:id
GET /readers/user/:userId
GET /readers/card/:cardNumber
```
- **Mô tả**: Lấy thông tin chi tiết độc giả theo ID/UserID/Số thẻ
- **Response**: 200 - Thông tin chi tiết độc giả
- **Lỗi**: 404 - Không tìm thấy độc giả

### 9. Cập Nhật Thông Tin Độc Giả
```http
PATCH /readers/:id
```
- **Mô tả**: Cập nhật thông tin độc giả
- **Body**: UpdateReaderDto
- **Response**: 200 - Thông tin độc giả đã cập nhật
- **Lỗi**:
  - 404: Không tìm thấy độc giả
  - 400: Dữ liệu không hợp lệ

### 10. Quản Lý Trạng Thái Thẻ
```http
PATCH /readers/:id/activate
PATCH /readers/:id/deactivate
```
- **Mô tả**: Kích hoạt/Vô hiệu hóa thẻ độc giả
- **Response**: 200 - Thông tin độc giả sau khi cập nhật
- **Lỗi**: 404 - Không tìm thấy độc giả

### 11. Kiểm Tra và Gia Hạn Thẻ
```http
GET /readers/:id/check-expiry
PATCH /readers/:id/renew-card
```
- **Mô tả**: Kiểm tra hạn thẻ và gia hạn thẻ độc giả
- **Body** (cho renew-card):
  ```json
  {
    "newExpiryDate": "YYYY-MM-DD"
  }
  ```
- **Response**: 200 - Kết quả kiểm tra hoặc thông tin sau gia hạn
- **Lỗi**:
  - 404: Không tìm thấy độc giả
  - 400: Ngày hết hạn không hợp lệ

### 12. Xóa Hồ Sơ Độc Giả
```http
DELETE /readers/:id
```
- **Mô tả**: Xóa hồ sơ độc giả khỏi hệ thống
- **Response**: 204 - Xóa thành công
- **Lỗi**: 404 - Không tìm thấy độc giả

## 📝 Validation Rules

### CreateReaderDto
- **fullName**: Bắt buộc, chuỗi, tối đa 255 ký tự
- **dateOfBirth**: Bắt buộc, định dạng YYYY-MM-DD
- **gender**: Bắt buộc, một trong ['male', 'female', 'other']
- **address**: Bắt buộc, chuỗi
- **phone**: Bắt buộc, định dạng số điện thoại Việt Nam
- **userId**: UUID của user, phải tồn tại trong hệ thống
- **readerTypeId**: UUID của loại độc giả, phải tồn tại
- **cardNumber**: Tự động tạo nếu không cung cấp
- **cardIssueDate**: Mặc định ngày hiện tại
- **cardExpiryDate**: Bắt buộc, phải sau ngày cấp

### UpdateReaderDto
- Tất cả trường là không bắt buộc
- Các quy tắc validation giống CreateReaderDto
- Không cho phép cập nhật userId

## 🎯 Business Rules

1. **Tạo Độc Giả**
   - Mỗi user chỉ có thể có một hồ sơ độc giả
   - Số thẻ thư viện phải là duy nhất
   - Thẻ mới tạo mặc định có trạng thái active

2. **Quản Lý Thẻ**
   - Thẻ hết hạn không thể mượn sách
   - Thẻ bị vô hiệu hóa không thể mượn sách
   - Gia hạn thẻ phải có ngày hết hạn mới hợp lệ

3. **Xóa Độc Giả**
   - Chỉ có thể xóa độc giả không có sách đang mượn
   - Xóa độc giả không xóa tài khoản user tương ứng

## 📊 Monitoring

- Theo dõi số lượng thẻ hết hạn
- Theo dõi số lượng thẻ sắp hết hạn
- Thống kê số lượng độc giả theo loại
- Theo dõi tỷ lệ thẻ active/inactive