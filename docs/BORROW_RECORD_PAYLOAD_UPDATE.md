# 📋 Borrow Record Payload Update - Cập nhật Payload cho CreateBorrowRecordRequest

## 🎯 Mục tiêu

Cập nhật dialog tạo borrow record để đảm bảo payload đúng với `CreateBorrowRecordRequest` type và thêm validation cho form.

## ✅ Payload Structure theo CreateBorrowRecordRequest

### **Type Definition**:

```typescript
interface CreateBorrowRecordRequest {
	reader_id: string; // Required: UUID của độc giả
	copy_id: string; // Required: UUID của bản sao sách
	borrow_date?: string; // Optional: Ngày mượn
	due_date?: string; // Optional: Ngày hạn trả
	librarian_id: string; // Required: UUID của thủ thư
}
```

### **Payload Preparation**:

```typescript
// Prepare payload according to CreateBorrowRecordRequest
const payload: CreateBorrowRecordRequest = {
	reader_id: formData.reader_id,
	copy_id: formData.copy_id,
	librarian_id: formData.librarian_id,
};

// Add optional fields only if they have values
if (formData.borrow_date) {
	payload.borrow_date = formData.borrow_date;
}

if (formData.due_date) {
	payload.due_date = formData.due_date;
}
```

## 🔧 Form Validation

### **1. Required Fields Validation**:

```typescript
const validateForm = (): boolean => {
	const newErrors: Record<string, string> = {};

	// Required fields validation
	if (!formData.reader_id) {
		newErrors.reader_id = 'Vui lòng chọn độc giả';
	}

	if (!formData.copy_id) {
		newErrors.copy_id = 'Vui lòng chọn bản sao sách';
	}

	if (!formData.librarian_id) {
		newErrors.librarian_id = 'Vui lòng nhập ID thủ thư';
	}

	// Date validation
	if (formData.borrow_date && formData.due_date) {
		const borrowDate = new Date(formData.borrow_date);
		const dueDate = new Date(formData.due_date);

		if (dueDate <= borrowDate) {
			newErrors.due_date = 'Ngày hạn trả phải sau ngày mượn';
		}
	}

	setErrors(newErrors);
	return Object.keys(newErrors).length === 0;
};
```

### **2. Error State Management**:

```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

// Clear error when user starts typing
const handleInputChange = (field: string, value: string) => {
	setFormData((prev) => ({ ...prev, [field]: value }));

	// Clear error when user starts typing
	if (errors[field]) {
		setErrors((prev) => ({ ...prev, [field]: '' }));
	}
};
```

### **3. Form Reset**:

```typescript
const resetForm = () => {
	setFormData({
		reader_id: '',
		copy_id: '',
		borrow_date: '',
		due_date: '',
		librarian_id: '',
	});
	setErrors({});
};
```

## 🎨 UI Error Display

### **1. Error Messages**:

```typescript
{
	errors.reader_id && (
		<p className="text-sm text-red-600">{errors.reader_id}</p>
	);
}

{
	errors.copy_id && <p className="text-sm text-red-600">{errors.copy_id}</p>;
}

{
	errors.librarian_id && (
		<p className="text-sm text-red-600">{errors.librarian_id}</p>
	);
}

{
	errors.due_date && <p className="text-sm text-red-600">{errors.due_date}</p>;
}
```

### **2. Form Submission**:

```typescript
const handleSubmit = (e: React.FormEvent) => {
	e.preventDefault();

	if (!validateForm()) {
		return;
	}

	// Prepare payload according to CreateBorrowRecordRequest
	const payload: CreateBorrowRecordRequest = {
		reader_id: formData.reader_id,
		copy_id: formData.copy_id,
		librarian_id: formData.librarian_id,
	};

	// Add optional fields only if they have values
	if (formData.borrow_date) {
		payload.borrow_date = formData.borrow_date;
	}

	if (formData.due_date) {
		payload.due_date = formData.due_date;
	}

	onSubmit(payload);
};
```

## 📊 Validation Rules

### **1. Required Fields**:

- ✅ **reader_id**: Phải chọn độc giả
- ✅ **copy_id**: Phải chọn bản sao sách
- ✅ **librarian_id**: Phải nhập ID thủ thư

### **2. Optional Fields**:

- 📋 **borrow_date**: Ngày mượn (tự động tính nếu không nhập)
- 📋 **due_date**: Ngày hạn trả (tự động tính +14 ngày nếu không nhập)

### **3. Date Validation**:

- ✅ **due_date > borrow_date**: Ngày hạn trả phải sau ngày mượn
- ✅ **Auto-calculation**: Tự động tính due_date = borrow_date + 14 ngày

## 🔄 Auto-calculation Logic

### **1. Due Date Calculation**:

```typescript
const handleBorrowDateChange = (date: string) => {
	handleInputChange('borrow_date', date);

	// Clear due date error if exists
	if (errors.due_date) {
		setErrors((prev) => ({ ...prev, due_date: '' }));
	}

	if (date && !formData.due_date) {
		const borrowDate = new Date(date);
		const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 days
		handleInputChange('due_date', dueDate.toISOString().split('T')[0]);
	}
};
```

### **2. Error Clearing**:

```typescript
// Clear error when user starts typing
if (errors[field]) {
	setErrors((prev) => ({ ...prev, [field]: '' }));
}

// Clear due date error when borrow date changes
if (errors.due_date) {
	setErrors((prev) => ({ ...prev, due_date: '' }));
}
```

## ✅ Benefits

### **1. Type Safety**:

- ✅ **Exact Payload**: Payload khớp 100% với CreateBorrowRecordRequest
- ✅ **Optional Fields**: Chỉ gửi optional fields khi có giá trị
- ✅ **TypeScript Support**: Full type checking

### **2. Form Validation**:

- ✅ **Required Validation**: Kiểm tra các trường bắt buộc
- ✅ **Date Validation**: Kiểm tra logic ngày tháng
- ✅ **Real-time Feedback**: Hiển thị lỗi ngay lập tức
- ✅ **Error Clearing**: Tự động xóa lỗi khi user sửa

### **3. User Experience**:

- ✅ **Clear Error Messages**: Thông báo lỗi rõ ràng bằng tiếng Việt
- ✅ **Auto-calculation**: Tự động tính ngày hạn trả
- ✅ **Form Reset**: Reset form và errors khi đóng dialog
- ✅ **Loading States**: Disable form khi đang submit

### **4. Data Integrity**:

- ✅ **Validation**: Đảm bảo dữ liệu hợp lệ trước khi gửi
- ✅ **Payload Structure**: Đúng format theo API specification
- ✅ **Error Handling**: Xử lý lỗi validation gracefully

## 🎯 Usage Examples

### **1. Valid Payload**:

```typescript
// All required fields + optional dates
{
  reader_id: "550e8400-e29b-41d4-a716-446655440000",
  copy_id: "550e8400-e29b-41d4-a716-446655440001",
  librarian_id: "550e8400-e29b-41d4-a716-446655440002",
  borrow_date: "2024-01-01",
  due_date: "2024-01-15"
}
```

### **2. Minimal Payload**:

```typescript
// Only required fields
{
  reader_id: "550e8400-e29b-41d4-a716-446655440000",
  copy_id: "550e8400-e29b-41d4-a716-446655440001",
  librarian_id: "550e8400-e29b-41d4-a716-446655440002"
}
```

### **3. Invalid Payload (Validation Error)**:

```typescript
// Missing required fields
{
  reader_id: "",           // ❌ Error: "Vui lòng chọn độc giả"
  copy_id: "",             // ❌ Error: "Vui lòng chọn bản sao sách"
  librarian_id: "",        // ❌ Error: "Vui lòng nhập ID thủ thư"
  borrow_date: "2024-01-15",
  due_date: "2024-01-01"   // ❌ Error: "Ngày hạn trả phải sau ngày mượn"
}
```

## 🔮 Future Enhancements

### **1. Advanced Validation**:

- 📋 **UUID Format**: Validate UUID format cho reader_id, copy_id, librarian_id
- 📋 **Date Range**: Kiểm tra ngày mượn không quá xa trong tương lai
- 📋 **Business Rules**: Kiểm tra độc giả có thể mượn thêm sách không

### **2. Enhanced UX**:

- 📋 **Field Dependencies**: Disable due_date cho đến khi chọn borrow_date
- 📋 **Smart Defaults**: Tự động set borrow_date = today nếu không chọn
- 📋 **Confirmation Dialog**: Xác nhận trước khi tạo giao dịch

### **3. Error Handling**:

- 📋 **API Error Mapping**: Map API errors về validation errors
- 📋 **Retry Logic**: Tự động retry khi có lỗi network
- 📋 **Error Logging**: Log errors để debug

## ✅ Kết luận

Việc cập nhật payload đã thành công:

- **Payload Structure**: Khớp 100% với CreateBorrowRecordRequest type
- **Form Validation**: Đầy đủ validation cho required fields và date logic
- **Error Handling**: Hiển thị lỗi rõ ràng và real-time feedback
- **Auto-calculation**: Tự động tính ngày hạn trả
- **Type Safety**: Full TypeScript support và type checking

Dialog tạo borrow record giờ đây đảm bảo dữ liệu chính xác và trải nghiệm người dùng tốt! 🎉

---

**Last Updated**: 2024-01-01
**Status**: ✅ Completed
**Payload Structure**: ✅ Matches CreateBorrowRecordRequest
**Validation**: ✅ Required fields + Date logic
**Error Handling**: ✅ Real-time feedback + Clear messages
