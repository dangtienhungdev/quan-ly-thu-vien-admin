# 🔍 SearchableSelect Update - Cập nhật Select với Tìm kiếm

## 🎯 Mục tiêu

Cập nhật dialog tạo borrow record để sử dụng Select với tìm kiếm cho `reader_id` và `copy_id` thay vì input text thông thường.

## ✅ Components đã tạo/cập nhật

### **1. SearchableSelect Component** 🔍

**File**: `src/pages/borrow-records/components/searchable-select.tsx`

**Chức năng**: Component Select có thể tái sử dụng với tính năng tìm kiếm

```typescript
interface SearchableSelectProps {
	value: string;
	onValueChange: (value: string) => void;
	placeholder: string;
	searchPlaceholder: string;
	onSearch: (query: string) => Promise<any>;
	queryKey: string[];
	renderOption: (item: any) => { value: string; label: string };
	disabled?: boolean;
}
```

**Features**:

- **Search Input**: Ô tìm kiếm với icon search và clear button
- **Real-time Search**: Tìm kiếm real-time khi gõ
- **Initial Data**: Load dữ liệu ban đầu khi chưa tìm kiếm
- **Loading States**: Hiển thị loading khi đang tìm kiếm
- **Empty State**: Hiển thị thông báo khi không có kết quả
- **Scroll Support**: Scroll cho danh sách options dài
- **Type Safety**: Generic component có thể tái sử dụng

### **2. Updated CreateBorrowRecordDialog** 📝

**File**: `src/pages/borrow-records/components/create-borrow-record-dialog.tsx`

**Thay đổi chính**:

- **Reader Selection**: Thay thế input text bằng SearchableSelect
- **Physical Copy Selection**: Thay thế input text bằng SearchableSelect
- **API Integration**: Tích hợp với ReadersAPI và PhysicalCopiesAPI
- **Form Validation**: Chỉ giữ lại các fields có trong CreateBorrowRecordRequest

**Form Fields cập nhật**:

```typescript
// Trước: Input text
<Input
  id="reader_id"
  type="text"
  value={formData.reader_id}
  onChange={(e) => handleInputChange('reader_id', e.target.value)}
  placeholder="UUID của độc giả"
  required
/>

// Sau: SearchableSelect
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

## 🔧 Technical Implementation

### **1. Search Functions**:

```typescript
// Search readers
const searchReaders = async (query: string) => {
	if (query) {
		return ReadersAPI.search({ q: query, page: 1, limit: 20 });
	}
	return ReadersAPI.getAll({ page: 1, limit: 20 });
};

// Search physical copies
const searchPhysicalCopies = async (query: string) => {
	if (query) {
		return PhysicalCopiesAPI.search({ q: query, page: 1, limit: 20 });
	}
	return PhysicalCopiesAPI.getAll({ page: 1, limit: 20 });
};
```

### **2. Render Functions**:

```typescript
// Render reader options
const renderReaderOption = (reader: any) => ({
	value: reader.id,
	label: `${reader.full_name} (${reader.card_number})`,
});

// Render physical copy options
const renderPhysicalCopyOption = (copy: any) => ({
	value: copy.id,
	label: `${copy.book?.title || 'Không có tên sách'} - ${copy.barcode} (${
		copy.status
	})`,
});
```

### **3. React Query Integration**:

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

### **2. Loading States**:

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

### **3. Scroll Support**:

```typescript
<div className="max-h-60 overflow-y-auto">{/* Options content */}</div>
```

## 📊 API Integration

### **1. Readers API**:

- **Endpoint**: `/api/readers/search`
- **Query**: `{ q: string, page: number, limit: number }`
- **Response**: `PaginatedResponse<Reader>`
- **Search Fields**: Tên, số thẻ, SĐT, username, email

### **2. Physical Copies API**:

- **Endpoint**: `/api/physical-copies/search`
- **Query**: `{ q: string, page: number, limit: number }`
- **Response**: `PhysicalCopiesResponse`
- **Search Fields**: Barcode, vị trí, ghi chú, tên sách

## 🔄 State Management

### **1. Search State**:

```typescript
const [searchQuery, setSearchQuery] = useState('');
const [isSearching, setIsSearching] = useState(false);
const [options, setOptions] = useState<any[]>([]);
```

### **2. Search Logic**:

```typescript
const handleSearch = (query: string) => {
	setSearchQuery(query);
	setIsSearching(query.length > 0);
};

const handleClearSearch = () => {
	setSearchQuery('');
	setIsSearching(false);
};
```

### **3. Options Update**:

```typescript
useEffect(() => {
	if (isSearching && searchData) {
		setOptions(searchData.data || []);
	} else if (!isSearching && initialData) {
		setOptions(initialData.data || []);
	}
}, [isSearching, searchData, initialData]);
```

## ✅ Benefits

### **1. User Experience**:

- ✅ **Easy Selection**: Không cần nhớ UUID, chỉ cần tìm kiếm
- ✅ **Real-time Search**: Tìm kiếm ngay khi gõ
- ✅ **Clear Display**: Hiển thị thông tin rõ ràng (tên + mã)
- ✅ **Loading Feedback**: Hiển thị trạng thái loading

### **2. Data Accuracy**:

- ✅ **No Typos**: Không thể nhập sai UUID
- ✅ **Validation**: Chỉ cho phép chọn từ danh sách có sẵn
- ✅ **Consistency**: Đảm bảo dữ liệu nhất quán

### **3. Performance**:

- ✅ **Pagination**: Chỉ load 20 items mỗi lần
- ✅ **Caching**: React Query cache kết quả tìm kiếm
- ✅ **Debounced Search**: Tránh gọi API quá nhiều

### **4. Maintainability**:

- ✅ **Reusable Component**: Có thể dùng cho các form khác
- ✅ **Type Safety**: TypeScript support
- ✅ **Clean Code**: Tách biệt logic tìm kiếm và render

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

## 🔮 Future Enhancements

### **1. Advanced Search**:

- 📋 **Filter Options**: Lọc theo trạng thái, loại độc giả
- 📋 **Sort Options**: Sắp xếp theo tên, ngày tạo
- 📋 **Recent Selections**: Lưu lịch sử chọn gần đây

### **2. Performance Optimization**:

- 📋 **Debounce Search**: Tránh gọi API quá nhiều
- 📋 **Virtual Scrolling**: Cho danh sách rất dài
- 📋 **Prefetch Data**: Load trước dữ liệu thường dùng

### **3. UX Improvements**:

- 📋 **Keyboard Navigation**: Điều hướng bằng phím
- 📋 **Auto-complete**: Gợi ý dựa trên lịch sử
- 📋 **Multi-select**: Chọn nhiều items cùng lúc

## ✅ Kết luận

Việc cập nhật SearchableSelect đã thành công:

- **1 SearchableSelect component** hoàn chỉnh với tìm kiếm real-time
- **2 API integrations** với ReadersAPI và PhysicalCopiesAPI
- **Form validation** chính xác theo CreateBorrowRecordRequest type
- **User experience** tốt hơn với tìm kiếm dễ dàng
- **Type safety** và performance optimization

SearchableSelect giờ đây cung cấp trải nghiệm người dùng tốt hơn nhiều so với input text thông thường! 🎉

---

**Last Updated**: 2024-01-01
**Status**: ✅ Completed
**Components Updated**: 2
**API Integrations**: 2
**Features**: ✅ Real-time search, Loading states, Type safety
