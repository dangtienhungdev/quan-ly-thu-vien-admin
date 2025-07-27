# API Services Documentation

## Tổng quan

Thư mục `src/apis` chứa tất cả các API services được tạo dựa trên tài liệu docs. Mỗi service được cấu trúc dưới dạng object với các phương thức async để tương tác với backend API.

## Cấu trúc

```
src/apis/
├── auth.ts              # Authentication API object
├── authors.ts           # Authors API object
├── books.ts             # Books API object
├── categories.ts        # Categories API object
├── publishers.ts        # Publishers API object
├── readers.ts           # Readers API object
├── index.ts             # Export tất cả API objects
└── README.md            # Tài liệu này
```

## Cách sử dụng

### 1. Import API Objects

```typescript
import { AuthAPI, AuthorsAPI, BooksAPI } from '@/apis';
```

### 2. Sử dụng Authentication

```typescript
// Đăng nhập
const authResponse = await AuthAPI.login({
  username: 'admin',
  password: 'password123'
});

// Response structure:
// {
//   access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
// }

// Lưu token và user data
AuthAPI.saveAuthData(authResponse);

// Kiểm tra trạng thái đăng nhập
const isLoggedIn = AuthAPI.isAuthenticated();

// Lấy thông tin user hiện tại (requires separate API call)
// const currentUser = AuthAPI.getCurrentUser(); // Returns null as user data is not stored

// Đăng xuất
await AuthAPI.logout();
```

#### Sử dụng access_token

Sau khi đăng nhập thành công, `access_token` sẽ được tự động lưu vào localStorage và được sử dụng cho tất cả các API calls tiếp theo thông qua axios interceptors trong `instances.ts`.

```typescript
// Token được tự động thêm vào header Authorization
// Authorization: Bearer <access_token>

// Bạn cũng có thể truy cập token trực tiếp:
const token = localStorage.getItem('accessToken');
```

#### Lưu ý về User Data

Login response chỉ trả về `access_token`, không bao gồm thông tin user. Để lấy thông tin user, bạn cần gọi API riêng (ví dụ: `/api/auth/me` hoặc `/api/users/profile`) với token đã lưu.

```typescript
// Ví dụ: Lấy thông tin user
const getUserInfo = async () => {
  const response = await instance.get('/api/auth/me');
  return response.data;
};
```

### 3. Sử dụng Authors API

```typescript
// Lấy danh sách tác giả
const authors = await AuthorsAPI.getAll({ page: 1, limit: 10 });

// Tạo tác giả mới
const newAuthor = await AuthorsAPI.create({
  author_name: 'Nguyễn Nhật Ánh',
  bio: 'Nhà văn chuyên viết cho thanh thiếu niên',
  nationality: 'Việt Nam'
});

// Tìm kiếm tác giả
const searchResults = await AuthorsAPI.search({
  q: 'Nguyễn',
  page: 1,
  limit: 10
});

// Cập nhật tác giả
const updatedAuthor = await AuthorsAPI.update(authorId, {
  bio: 'Mô tả mới'
});

// Xóa tác giả
await AuthorsAPI.delete(authorId);
```

### 4. Sử dụng Books API

```typescript
// Lấy danh sách sách
const books = await BooksAPI.getAll({ page: 1, limit: 10 });

// Tạo sách mới
const newBook = await BooksAPI.create({
  title: 'Tên sách',
  isbn: '1234567890',
  publish_year: 2024,
  edition: '1st',
  description: 'Mô tả sách',
  language: 'Tiếng Việt',
  page_count: 300,
  book_type: 'physical',
  physical_type: 'borrowable',
  publisher_id: 'publisher-uuid',
  category_id: 'category-uuid'
});

// Tìm kiếm sách
const searchResults = await BooksAPI.search({
  q: 'tên sách',
  page: 1,
  limit: 10
});

// Lấy sách theo ISBN
const book = await BooksAPI.getByIsbn({ isbn: '1234567890' });
```

### 5. Sử dụng Categories API

```typescript
// Lấy danh sách thể loại
const categories = await CategoriesAPI.getAll({ page: 1, limit: 10 });

// Lấy thể loại chính
const mainCategories = await CategoriesAPI.getMain();

// Lấy thể loại con
const subcategories = await CategoriesAPI.getSubcategories({
  id: 'parent-category-id',
  page: 1,
  limit: 10
});

// Tạo thể loại mới
const newCategory = await CategoriesAPI.create({
  category_name: 'Sách Khoa Học',
  description: 'Các sách về khoa học',
  parent_id: 'parent-id' // Optional
});
```

### 6. Sử dụng Publishers API

```typescript
// Lấy danh sách nhà xuất bản
const publishers = await PublishersAPI.getAll({ page: 1, limit: 10 });

// Tạo nhà xuất bản mới
const newPublisher = await PublishersAPI.create({
  publisher_name: 'NXB Kim Đồng',
  address: '55 Quang Trung, Hà Nội',
  phone: '024-3821-4789',
  email: 'info@nxbkimdong.com.vn',
  country: 'Việt Nam'
});

// Tạo nhiều nhà xuất bản
const bulkResult = await PublishersAPI.createBulk({
  publishers: [
    { publisher_name: 'NXB A', country: 'Việt Nam' },
    { publisher_name: 'NXB B', country: 'Việt Nam' }
  ]
});
```

### 7. Sử dụng Readers API

```typescript
// Lấy danh sách độc giả
const readers = await ReadersAPI.getAll({ page: 1, limit: 10 });

// Tạo độc giả mới
const newReader = await ReadersAPI.create({
  user_id: 'user-uuid',
  full_name: 'Nguyễn Văn A',
  date_of_birth: '1990-01-01',
  gender: 'male',
  phone: '0123456789',
  email: 'nguyenvana@email.com',
  address: 'Hà Nội',
  reader_type_id: 'reader-type-uuid'
});

// Lấy thẻ hết hạn
const expiredCards = await ReadersAPI.getExpiredCards();

// Lấy thẻ sắp hết hạn
const expiringSoon = await ReadersAPI.getExpiringSoon({ days: 30 });

// Tạo số thẻ mới
const cardNumber = await ReadersAPI.generateCardNumber();
```

## API Object Structure

Mỗi API object có cấu trúc chuẩn với các phương thức:

### Standard CRUD Operations
- `getAll(params?)` - Lấy danh sách với phân trang
- `getById(id)` - Lấy theo ID
- `create(data)` - Tạo mới
- `update(id, data)` - Cập nhật
- `delete(id)` - Xóa

### Additional Methods
- `search(params)` - Tìm kiếm
- `getBySlug(slug)` - Lấy theo slug
- `createBulk(data)` - Tạo nhiều (nếu có)

## Error Handling

Tất cả API calls đều sử dụng axios interceptors từ `instances.ts` để xử lý lỗi:

```typescript
try {
  const authors = await AuthorsAPI.getAll();
} catch (error) {
  if (error.response) {
    console.error(`Error ${error.response.status}: ${error.response.data.message}`);
    // Xử lý lỗi theo status code
    switch (error.response.status) {
      case 401:
        // Unauthorized - redirect to login
        break;
      case 403:
        // Forbidden - show access denied
        break;
      case 404:
        // Not found
        break;
      default:
        // Other errors
        break;
    }
  }
}
```

## Environment Variables

Cấu hình API base URL trong file `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Authentication

Tất cả API calls (trừ login) đều yêu cầu JWT token. Token được tự động gửi trong header `Authorization: Bearer <token>` thông qua axios interceptors trong `instances.ts`.

Token được lưu trong localStorage và được quản lý bởi `AuthAPI`.

## Pagination

Hầu hết các API đều hỗ trợ phân trang với các tham số:
- `page`: Số trang (mặc định: 1)
- `limit`: Số lượng mỗi trang (mặc định: 10)

Response format:
```typescript
{
  data: T[],
  meta: {
    page: number,
    limit: number,
    totalItems: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}
```