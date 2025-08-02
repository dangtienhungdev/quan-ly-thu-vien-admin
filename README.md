# 📚 Hệ thống Quản lý Thư viện - Library Management System

## 🎯 Tổng quan

Hệ thống Quản lý Thư viện là một ứng dụng web hiện đại được xây dựng bằng React + TypeScript + Vite, cung cấp giải pháp toàn diện cho việc quản lý thư viện. Hệ thống hỗ trợ quản lý cả sách vật lý và sách điện tử, với các tính năng mượn trả, đặt trước, và theo dõi hoạt động thư viện.

## ✨ Tính năng chính

### 📖 Quản lý Sách

- **Thông tin sách**: Quản lý thông tin cơ bản của sách (tên, ISBN, tác giả, nhà xuất bản, v.v.)
- **Bản sao vật lý**: Theo dõi từng bản sao sách vật lý với barcode, vị trí, tình trạng
- **Sách điện tử**: Quản lý file sách điện tử với nhiều định dạng (PDF, EPUB, MOBI, v.v.)

### 👥 Quản lý Người dùng

- **Phân loại độc giả**: Student, Teacher, Staff với các quyền mượn khác nhau
- **Thông tin độc giả**: Quản lý thẻ thư viện, thông tin cá nhân
- **Phân quyền**: Admin và Reader với các quyền truy cập khác nhau

### 🔄 Giao dịch Thư viện

- **Mượn trả sách**: Quản lý quy trình mượn trả với tracking chi tiết
- **Đặt trước sách**: Hệ thống đặt trước với thông báo khi sách có sẵn
- **Gia hạn sách**: Cho phép gia hạn thời gian mượn
- **Quản lý phạt**: Tự động tính phạt cho sách trả muộn

### 📊 Báo cáo và Thống kê

- **Dashboard**: Tổng quan hoạt động thư viện
- **Thống kê theo module**: Báo cáo chi tiết cho từng lĩnh vực
- **Theo dõi xu hướng**: Phân tích hoạt động theo thời gian

## 🏗️ Kiến trúc Hệ thống

### Frontend Stack

- **React 19**: Framework chính
- **TypeScript**: Type safety
- **Vite**: Build tool và dev server
- **Tailwind CSS**: Styling
- **Shadcn/ui**: Component library
- **React Query**: State management
- **React Router**: Routing
- **Axios**: HTTP client

### Database Schema

Hệ thống sử dụng 13 bảng chính:

- **User Management**: Users, ReaderTypes, Readers
- **Book Management**: Books, Authors, Categories, Publishers, BookAuthors, PhysicalCopies, EBooks
- **Transaction Management**: BorrowRecords, Reservations, Renewals, Fines

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn

### Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd quan-ly-thu-vien-admin

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
```

### Cấu hình

Tạo file `.env` với các biến môi trường:

```env
VITE_API_BASE_URL=http://localhost:8002
VITE_APP_NAME=Library Management System
```

## 📁 Cấu trúc Dự án

```
src/
├── apis/                    # API functions
│   ├── auth.ts             # Authentication API
│   ├── books.ts            # Books API
│   ├── ebooks.ts           # EBooks API
│   ├── physical-copies.ts  # Physical Copies API
│   ├── borrow-records.ts   # Borrow Records API
│   ├── reservations.ts     # Reservations API
│   └── ...
├── components/             # Reusable components
│   ├── ui/                # Shadcn/ui components
│   └── ...
├── pages/                 # Page components
│   ├── books/             # Books management
│   ├── ebooks/            # EBooks management
│   ├── physical-copies/   # Physical copies management
│   ├── borrow-records/    # Borrow records management
│   ├── reservations/      # Reservations management
│   └── ...
├── types/                 # TypeScript type definitions
│   ├── books.ts           # Book types
│   ├── ebooks.ts          # EBook types
│   ├── physical-copies.ts # Physical copy types
│   ├── borrow-records.ts  # Borrow record types
│   ├── reservations.ts    # Reservation types
│   └── ...
├── layout/                # Layout components
├── hooks/                 # Custom hooks
├── lib/                   # Utility functions
└── configs/               # Configuration files
```

## 🔧 Các Module Chính

### 1. Quản lý Sách (Books)

- **Endpoint**: `/books`
- **Tính năng**: CRUD sách, tìm kiếm, phân trang
- **Quyền**: Admin có thể thêm/sửa/xóa

### 2. Quản lý Bản sao Vật lý (Physical Copies)

- **Endpoint**: `/physical-copies`
- **Tính năng**:
  - Quản lý barcode, vị trí, tình trạng
  - Tracking trạng thái (available, borrowed, reserved, damaged, lost, maintenance)
  - Thống kê theo vị trí và tình trạng

### 3. Quản lý Sách Điện tử (EBooks)

- **Endpoint**: `/ebooks`
- **Tính năng**:
  - Quản lý file với nhiều định dạng
  - Tracking lượt tải
  - Thống kê theo định dạng và dung lượng

### 4. Quản lý Mượn Trả (Borrow Records)

- **Endpoint**: `/borrow-records`
- **Tính năng**:
  - Tạo giao dịch mượn trả
  - Tracking trạng thái (borrowed, returned, overdue, renewed)
  - Thông báo sách quá hạn và sắp đến hạn

### 5. Quản lý Đặt Trước (Reservations)

- **Endpoint**: `/reservations`
- **Tính năng**:
  - Đặt trước sách
  - Tracking trạng thái (pending, fulfilled, cancelled, expired)
  - Thông báo khi sách có sẵn

## 🔐 Xác thực và Phân quyền

### Roles

- **Admin**: Toàn quyền truy cập và quản lý
- **Reader**: Chỉ xem thông tin và thực hiện các thao tác được phép

### Authentication

- JWT token-based authentication
- Automatic token refresh
- Protected routes

## 📊 API Documentation

### Base URL

```
http://localhost:8002/api
```

### Authentication

```http
Authorization: Bearer <jwt_token>
```

### Common Response Format

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## 🎨 UI/UX Features

### Design System

- **Shadcn/ui**: Modern component library
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching support

### User Experience

- **Intuitive Navigation**: Sidebar navigation với grouping
- **Real-time Updates**: React Query cho data synchronization
- **Loading States**: Skeleton loading và progress indicators
- **Error Handling**: Toast notifications và error boundaries
- **Search & Filter**: Advanced search và filtering capabilities

## 🚀 Performance Optimization

### Frontend

- **Code Splitting**: Lazy loading cho pages
- **Memoization**: React.memo và useMemo
- **Virtual Scrolling**: Cho large datasets
- **Image Optimization**: Lazy loading images

### API

- **Pagination**: Efficient data loading
- **Caching**: React Query caching
- **Optimistic Updates**: Immediate UI feedback

## 🔧 Development

### Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
```

### Code Quality

- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Prettier**: Code formatting
- **Husky**: Git hooks

## 📈 Monitoring và Analytics

### Key Metrics

- Số lượng sách và bản sao
- Tỷ lệ mượn trả
- Sách phổ biến
- Hoạt động độc giả

### Error Tracking

- Console logging
- Error boundaries
- API error handling

## 🔮 Roadmap

### Phase 1 - Core Features ✅

- [x] Basic CRUD operations
- [x] Authentication & Authorization
- [x] Book management
- [x] Physical copies management
- [x] EBooks management
- [x] Borrow/Return system
- [x] Reservation system

### Phase 2 - Advanced Features 📋

- [ ] Mobile app support
- [ ] Advanced analytics dashboard
- [ ] Email/SMS notifications
- [ ] Barcode scanning integration
- [ ] File upload for ebooks
- [ ] Advanced reporting

### Phase 3 - Enterprise Features 📋

- [ ] Multi-library support
- [ ] Advanced workflow automation
- [ ] Integration với external systems
- [ ] AI-powered recommendations
- [ ] Advanced security features

## 🤝 Đóng góp

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Hỗ trợ

- **Email**: dangtienhung.dev@gmail.com
- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

---

**Phiên bản**: 2.0.0
**Cập nhật cuối**: 2024-01-01
**Tác giả**: Đặng Tiến Hưng
