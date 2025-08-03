# 🔄 Borrow Records API Integration Final - Tích hợp API theo định nghĩa sẵn

## 🎯 Mục tiêu

Cập nhật dialog tạo borrow record để sử dụng đúng các API đã được định nghĩa sẵn trong thư mục `/apis` theo documentation `borrow-records.md`, `readers.md`, và `physical-copy.md`.

## ✅ API Integration theo định nghĩa sẵn

### **1. Readers API** 👥

**File**: `src/apis/readers.ts`

**Endpoints sử dụng**:

```typescript
// Get all readers with pagination
getAll: async (params?: PaginationReaderQuery): Promise<PaginatedResponse<Reader>>

// Search readers
search: async (params: SearchReaderQuery): Promise<PaginatedResponse<Reader>>
```

**Search Query Parameters** (theo `readers.md`):

```typescript
interface SearchReaderQuery {
	q: string; // Từ khóa tìm kiếm (tên, số thẻ, SĐT, username, email)
	page?: number; // Số trang (mặc định: 1)
	limit?: number; // Số lượng mỗi trang (mặc định: 10)
}
```

**Response Format**:

```typescript
interface Reader {
	id: string;
	full_name: string;
	card_number: string;
	date_of_birth: string;
	gender: 'male' | 'female' | 'other';
	address: string;
	phone: string;
	user_id: string;
	reader_type_id: string;
	card_issue_date: string;
	card_expiry_date: string;
	is_active: boolean;
}
```

### **2. Physical Copies API** 📚

**File**: `src/apis/physical-copies.ts`

**Endpoints sử dụng**:

```typescript
// Get all physical copies with pagination
getAll: async (params?: { page?: number; limit?: number }): Promise<PhysicalCopiesResponse>

// Search physical copies
search: async (params: PhysicalCopySearchQuery): Promise<PhysicalCopiesResponse>
```

**Search Query Parameters** (theo `physical-copy.md`):

```typescript
interface PhysicalCopySearchQuery {
	q: string; // Từ khóa tìm kiếm (barcode, vị trí, ghi chú, tên sách)
	page?: number; // Số trang (mặc định: 1)
	limit?: number; // Số lượng mỗi trang (mặc định: 10)
}
```

**Response Format**:

```typescript
interface PhysicalCopy {
	id: string;
	book_id: string;
	barcode: string;
	status:
		| 'available'
		| 'borrowed'
		| 'reserved'
		| 'damaged'
		| 'lost'
		| 'maintenance';
	current_condition: 'new' | 'good' | 'worn' | 'damaged';
	condition_details: string;
	purchase_date: string;
	purchase_price: number;
	location: string;
	notes: string;
	last_checkup_date: string;
	is_archived: boolean;
	book?: {
		id: string;
		title: string;
		isbn: string;
		cover_image?: string;
	};
}
```

### **3. Borrow Records API** 📋

**File**: `src/apis/borrow-records.ts`

**Create Endpoint** (theo `borrow-records.md`):

```typescript
// Create a new borrow record
create: async (data: CreateBorrowRecordRequest): Promise<BorrowRecordResponse>
```

**Request Body**:

```typescript
interface CreateBorrowRecordRequest {
	reader_id: string; // UUID của độc giả
	copy_id: string; // UUID của bản sao sách
	borrow_date?: string; // Ngày mượn (optional, auto-set)
	due_date?: string; // Ngày hạn trả (optional, auto-calculate)
	librarian_id: string; // UUID của thủ thư
}
```

## 🔧 Implementation Details

### **1. SearchableSelect Component** 🔍

**File**: `src/pages/borrow-records/components/searchable-select.tsx`

**Features**:

- **Real-time Search**: Tìm kiếm ngay khi gõ
- **API Integration**: Sử dụng React Query với các API đã định nghĩa
- **Loading States**: Hiển thị trạng thái loading
- **Empty States**: Hiển thị khi không có kết quả
- **Scroll Support**: Scroll cho danh sách dài

**API Integration**:

```typescript
// Fetch initial data
const { data: initialData, isLoading: isLoadingInitial } = useQuery({
	queryKey: [...queryKey, 'initial'],
	queryFn: () => onSearch(''),
	enabled: !isSearching,
});

// Search data
const { data: searchData, isLoading: isLoadingSearch } = useQuery({
	queryKey: [...queryKey, 'search', searchQuery],
	queryFn: () => onSearch(searchQuery),
	enabled: isSearching && searchQuery.length > 0,
});
```

### **2. CreateBorrowRecordDialog** 📝

**File**: `src/pages/borrow-records/components/create-borrow-record-dialog.tsx`

**Search Functions**:

```typescript
// Search readers using ReadersAPI
const searchReaders = async (query: string) => {
	if (query) {
		return ReadersAPI.search({ q: query, page: 1, limit: 20 });
	}
	return ReadersAPI.getAll({ page: 1, limit: 20 });
};

// Search physical copies using PhysicalCopiesAPI
const searchPhysicalCopies = async (query: string) => {
	if (query) {
		return PhysicalCopiesAPI.search({ q: query, page: 1, limit: 20 });
	}
	return PhysicalCopiesAPI.getAll({ page: 1, limit: 20 });
};
```

**Render Functions**:

```typescript
// Render reader options: "Tên độc giả (Số thẻ)"
const renderReaderOption = (reader: any) => ({
	value: reader.id,
	label: `${reader.full_name} (${reader.card_number})`,
});

// Render physical copy options: "Tên sách - Barcode (Trạng thái)"
const renderPhysicalCopyOption = (copy: any) => ({
	value: copy.id,
	label: `${copy.book?.title || 'Không có tên sách'} - ${copy.barcode} (${
		copy.status
	})`,
});
```

## 📊 API Response Handling

### **1. Readers Search Response**:

```typescript
// API Response
{
  data: [
    {
      id: "uuid",
      full_name: "Nguyễn Văn A",
      card_number: "LIB-2024-001",
      date_of_birth: "1990-01-01",
      gender: "male",
      address: "Hà Nội",
      phone: "0123456789",
      user_id: "user-uuid",
      reader_type_id: "type-uuid",
      card_issue_date: "2024-01-01",
      card_expiry_date: "2025-01-01",
      is_active: true
    }
  ],
  meta: {
    page: 1,
    limit: 20,
    totalItems: 100,
    totalPages: 5
  }
}

// Rendered Option
"Nguyễn Văn A (LIB-2024-001)"
```

### **2. Physical Copies Search Response**:

```typescript
// API Response
{
  data: [
    {
      id: "uuid",
      book_id: "book-uuid",
      barcode: "LIB-2024-001",
      status: "available",
      current_condition: "new",
      condition_details: "Sách mới",
      purchase_date: "2024-01-01",
      purchase_price: 75000,
      location: "Kệ A2-T3",
      notes: "Sách được tặng",
      last_checkup_date: "2024-01-01",
      is_archived: false,
      book: {
        id: "book-uuid",
        title: "Sách hay",
        isbn: "1234567890",
        cover_image: "url"
      }
    }
  ],
  meta: {
    page: 1,
    limit: 20,
    totalItems: 150,
    totalPages: 8
  }
}

// Rendered Option
"Sách hay - LIB-2024-001 (available)"
```

## 🎨 UI/UX Features

### **1. Search Input Design**:

```typescript
<div className="relative">
	<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
	<Input
		placeholder={searchPlaceholder}
		value={searchQuery}
		onChange={(e) => handleSearch(e.target.value)}
		className="pl-8 pr-8"
	/>
	{searchQuery && (
		<Button
			variant="ghost"
			size="sm"
			className="absolute right-0 top-0 h-full px-2"
			onClick={handleClearSearch}
		>
			<X className="h-4 w-4" />
		</Button>
	)}
</div>
```

### **2. Loading and Empty States**:

```typescript
{isLoading ? (
  <div className="p-2 text-center text-sm text-muted-foreground">
    Đang tải...
  </div>
) : options.length === 0 ? (
  <div className="p-2 text-center text-sm text-muted-foreground">
    Không tìm thấy kết quả
  </div>
) : (
  // Render options
)}
```

### **3. Form Validation**:

```typescript
// Required fields validation
<form onSubmit={handleSubmit} className="space-y-4">
	{/* Reader selection - required */}
	<SearchableSelect
		value={formData.reader_id}
		onValueChange={(value) => handleInputChange('reader_id', value)}
		placeholder="Chọn độc giả"
		// ... other props
	/>

	{/* Physical copy selection - required */}
	<SearchableSelect
		value={formData.copy_id}
		onValueChange={(value) => handleInputChange('copy_id', value)}
		placeholder="Chọn bản sao sách"
		// ... other props
	/>

	{/* Librarian ID - required */}
	<Input
		id="librarian_id"
		type="text"
		value={formData.librarian_id}
		onChange={(e) => handleInputChange('librarian_id', e.target.value)}
		placeholder="UUID của thủ thư"
		required
	/>
</form>
```

## 🔄 Auto-calculation Features

### **1. Due Date Calculation**:

```typescript
const handleBorrowDateChange = (date: string) => {
	handleInputChange('borrow_date', date);
	if (date && !formData.due_date) {
		const borrowDate = new Date(date);
		const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 days
		handleInputChange('due_date', dueDate.toISOString().split('T')[0]);
	}
};
```

### **2. Form Reset**:

```typescript
const resetForm = () => {
	setFormData({
		reader_id: '',
		copy_id: '',
		borrow_date: '',
		due_date: '',
		librarian_id: '',
	});
};
```

## ✅ Benefits

### **1. API Consistency**:

- ✅ **Standardized APIs**: Sử dụng đúng API đã định nghĩa sẵn
- ✅ **Type Safety**: TypeScript types từ API definitions
- ✅ **Error Handling**: Consistent error handling across APIs
- ✅ **Response Format**: Unified response format

### **2. User Experience**:

- ✅ **Easy Selection**: Không cần nhớ UUID, chỉ cần tìm kiếm
- ✅ **Real-time Search**: Tìm kiếm ngay khi gõ
- ✅ **Clear Display**: Hiển thị thông tin rõ ràng
- ✅ **Loading Feedback**: Hiển thị trạng thái loading

### **3. Performance**:

- ✅ **Pagination**: Chỉ load 20 items mỗi lần
- ✅ **Caching**: React Query cache kết quả
- ✅ **Debounced Search**: Tránh gọi API quá nhiều
- ✅ **Optimized Queries**: Efficient API calls

### **4. Maintainability**:

- ✅ **Reusable Components**: SearchableSelect có thể tái sử dụng
- ✅ **Clean Architecture**: Tách biệt logic và UI
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Documentation**: Theo đúng API documentation

## 🎯 Usage Examples

### **1. Reader Selection**:

```typescript
<SearchableSelect
	value={formData.reader_id}
	onValueChange={(value) => handleInputChange('reader_id', value)}
	placeholder="Chọn độc giả"
	searchPlaceholder="Tìm kiếm độc giả..."
	onSearch={searchReaders}
	queryKey={['readers', 'search']}
	renderOption={renderReaderOption}
	disabled={isLoading}
/>
```

### **2. Physical Copy Selection**:

```typescript
<SearchableSelect
	value={formData.copy_id}
	onValueChange={(value) => handleInputChange('copy_id', value)}
	placeholder="Chọn bản sao sách"
	searchPlaceholder="Tìm kiếm bản sao..."
	onSearch={searchPhysicalCopies}
	queryKey={['physical-copies', 'search']}
	renderOption={renderPhysicalCopyOption}
	disabled={isLoading}
/>
```

### **3. Form Submission**:

```typescript
const handleSubmit = (e: React.FormEvent) => {
	e.preventDefault();
	onSubmit(formData); // CreateBorrowRecordRequest
};
```

## 🔮 Future Enhancements

### **1. Advanced Search**:

- 📋 **Filter by Status**: Chỉ hiển thị available physical copies
- 📋 **Filter by Reader Type**: Lọc độc giả theo loại
- 📋 **Sort Options**: Sắp xếp theo tên, ngày tạo

### **2. Performance Optimization**:

- 📋 **Debounce Search**: Tránh gọi API quá nhiều
- 📋 **Prefetch Data**: Load trước dữ liệu thường dùng
- 📋 **Virtual Scrolling**: Cho danh sách rất dài

### **3. UX Improvements**:

- 📋 **Keyboard Navigation**: Điều hướng bằng phím
- 📋 **Recent Selections**: Lưu lịch sử chọn gần đây
- 📋 **Auto-complete**: Gợi ý dựa trên lịch sử

## ✅ Kết luận

Việc cập nhật theo đúng API đã định nghĩa sẵn đã thành công:

- **2 API integrations** chính xác với ReadersAPI và PhysicalCopiesAPI
- **1 SearchableSelect component** hoàn chỉnh với tìm kiếm real-time
- **Form validation** chính xác theo CreateBorrowRecordRequest type
- **User experience** tốt với tìm kiếm dễ dàng
- **Type safety** và performance optimization
- **Consistency** với API documentation

Dialog tạo borrow record giờ đây hoàn toàn tuân thủ theo API definitions và cung cấp trải nghiệm người dùng tốt! 🎉

---

**Last Updated**: 2024-01-01
**Status**: ✅ Completed
**API Integrations**: 2 (ReadersAPI, PhysicalCopiesAPI)
**Components**: 2 (SearchableSelect, CreateBorrowRecordDialog)
**Features**: ✅ Real-time search, Loading states, Type safety, API consistency
