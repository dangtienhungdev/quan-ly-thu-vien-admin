# API Gửi Thông Báo Nhắc Nhở Đến Hạn Trả Sách

## 📋 Tổng quan

API này cho phép gửi thông báo nhắc nhở cho người dùng sắp đến hạn trả sách, giúp thư viện quản lý việc trả sách hiệu quả hơn.

## 🔗 Endpoints

### 1. Lấy Danh Sách Sách Gần Đến Hạn

```http
GET /api/borrow-records/near-due
```

**Query Parameters:**

- `page` (optional): Số trang (mặc định: 1)
- `limit` (optional): Số lượng mỗi trang (mặc định: 10)
- `daysBeforeDue` (optional): Số ngày trước khi đến hạn (mặc định: 2)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "reader": {
        "id": "uuid",
        "fullName": "Nguyễn Văn A"
      },
      "physicalCopy": {
        "book": {
          "title": "Tên sách"
        }
      },
      "due_date": "2024-12-21T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 5,
    "totalPages": 1
  }
}
```

### 2. Gửi Thông Báo Nhắc Nhở

```http
POST /api/borrow-records/send-reminders
```

**Request Body:**

```json
{
  "daysBeforeDue": 2,
  "customMessage": "Sách của bạn sắp đến hạn trả trong 2 ngày tới.",
  "readerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Parameters:**

- `daysBeforeDue` (optional): Số ngày trước khi đến hạn (mặc định: 2, tối đa: 7)
- `customMessage` (optional): Nội dung thông báo tùy chỉnh
- `readerId` (optional): ID độc giả cụ thể (nếu không có sẽ gửi cho tất cả)

**Response:**

```json
{
  "success": true,
  "message": "Đã gửi thông báo nhắc nhở cho 3 độc giả về 5 cuốn sách sắp đến hạn trả.",
  "totalReaders": 3,
  "notificationsSent": 5,
  "details": [
    {
      "readerId": "uuid",
      "readerName": "Nguyễn Văn A",
      "bookTitle": "Tên sách",
      "dueDate": "2024-12-21T10:00:00.000Z",
      "daysUntilDue": 2
    }
  ]
}
```

### 3. Lấy Thống Kê Sách Gần Đến Hạn

```http
GET /api/borrow-records/stats/near-due
```

**Query Parameters:**

- `daysBeforeDue` (optional): Số ngày trước khi đến hạn (mặc định: 2)

**Response:**

```json
{
  "totalNearDue": 15,
  "byDaysUntilDue": [
    { "daysUntilDue": 1, "count": 5 },
    { "daysUntilDue": 2, "count": 10 }
  ],
  "byReader": [
    { "readerName": "Nguyễn Văn A", "count": 3 },
    { "readerName": "Trần Thị B", "count": 2 }
  ],
  "byBookCategory": [
    { "category": "Công nghệ thông tin", "count": 8 },
    { "category": "Văn học", "count": 7 }
  ]
}
```

## 🚀 Cách sử dụng

### Gửi thông báo cho tất cả độc giả (2 ngày trước)

```bash
curl -X POST http://localhost:3000/api/borrow-records/send-reminders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "daysBeforeDue": 2,
    "customMessage": "Sách của bạn sắp đến hạn trả trong 2 ngày tới."
  }'
```

### Gửi thông báo cho một độc giả cụ thể

```bash
curl -X POST http://localhost:3000/api/borrow-records/send-reminders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "daysBeforeDue": 3,
    "readerId": "550e8400-e29b-41d4-a716-446655440000",
    "customMessage": "Xin chào! Sách của bạn sắp đến hạn trả."
  }'
```

### Lấy danh sách sách gần đến hạn

```bash
curl -X GET "http://localhost:3000/api/borrow-records/near-due?daysBeforeDue=2&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Tính năng

### ✅ Đã hoàn thành

- Lấy danh sách sách gần đến hạn với phân trang
- Gửi thông báo nhắc nhở cho tất cả hoặc một độc giả cụ thể
- Thống kê chi tiết về sách gần đến hạn
- Validation đầy đủ cho các tham số
- Logging chi tiết trong console

### 🔄 Cần tích hợp thêm

- Gửi email thực tế
- Gửi SMS
- Push notification
- Lưu lịch sử thông báo vào database
- Tích hợp với hệ thống queue (Redis/RabbitMQ)

## 🛠️ Tích hợp thực tế

Để tích hợp với hệ thống gửi thông báo thực tế, bạn có thể:

1. **Email**: Sử dụng Nodemailer hoặc SendGrid
2. **SMS**: Sử dụng Twilio hoặc Viettel SMS API
3. **Push Notification**: Sử dụng Firebase Cloud Messaging
4. **Queue**: Sử dụng Bull Queue với Redis

Ví dụ tích hợp email:

```typescript
// Trong method sendDueDateReminders
import * as nodemailer from 'nodemailer';

// Tạo transporter
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password',
  },
});

// Gửi email cho từng độc giả
for (const detail of notificationDetails) {
  await transporter.sendMail({
    from: 'thuvien@example.com',
    to: detail.readerEmail,
    subject: 'Nhắc nhở trả sách',
    html: `<p>${defaultMessage}</p><p>Sách: ${detail.bookTitle}</p><p>Ngày đến hạn: ${detail.dueDate}</p>`,
  });
}
```
