# 📚 Physical Book Integration - Áp dụng Logic cho Trang Physical Book

## 🎯 Mục tiêu

Áp dụng logic tương tự như trang ebook cho trang physical book, bao gồm:

- Tách components thành các module riêng biệt
- Tích hợp với API PhysicalCopiesAPI
- Tạo dialog cho việc tạo mới physical copy
- Quản lý trạng thái và tình trạng bản sao

## ✅ Components đã tạo

### **1. PhysicalDetailHeader** 📋

**File**: `src/pages/books/physical/[id]/components/physical-detail-header.tsx`

**Chức năng**: Header của trang với nút quay lại và tiêu đề

```typescript
interface PhysicalDetailHeaderProps {
	title?: string;
}
```

**Features**:

- Nút quay lại với icon ArrowLeft
- Tiêu đề trang "Chi tiết Sách Vật lý"
- Mô tả trang

### **2. PhysicalListCard** 📖

**File**: `src/pages/books/physical/[id]/components/physical-list-card.tsx`

**Chức năng**: Hiển thị danh sách physical copies và quản lý tương tác

```typescript
interface PhysicalListCardProps {
	physicalCopies: PhysicalCopy[];
	onCreateNew: () => void;
	onUpdateStatus: (copyId: string, status: CopyStatus) => void;
	onUpdateCondition: (copyId: string, condition: CopyCondition) => void;
}
```

**Features**:

- Danh sách physical copies với thông tin chi tiết
- Color coding cho trạng thái và tình trạng
- Icons trực quan cho từng trạng thái
- Format giá tiền và ngày tháng
- Nút cập nhật trạng thái và tình trạng
- Empty state khi chưa có bản sao

### **3. CreatePhysicalCopyDialog** 💬

**File**: `src/pages/books/physical/[id]/components/create-physical-copy-dialog.tsx`

**Chức năng**: Dialog modal để tạo physical copy mới

```typescript
interface CreatePhysicalCopyDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	bookId: string;
	bookTitle?: string;
	onSubmit: (data: CreatePhysicalCopyRequest) => void;
	isLoading?: boolean;
}
```

**Features**:

- Dialog modal với form tạo physical copy
- Form validation cho tất cả fields
- Select dropdown cho tình trạng
- Date picker cho ngày mua
- Number input cho giá mua
- Textarea cho chi tiết và ghi chú
- Auto-reset form khi đóng

### **4. Index File** 📁

**File**: `src/pages/books/physical/[id]/components/index.ts`

**Chức năng**: Export tất cả components

```typescript
export { PhysicalDetailHeader } from './physical-detail-header';
export { PhysicalListCard } from './physical-list-card';
export { CreatePhysicalCopyDialog } from './create-physical-copy-dialog';
```

## 🔄 Thay đổi trong Page chính

### **Trước:**

```typescript
const PhysicalBookDetailPage = () => {
	return (
		<div>
			<h1>Physical Book Detail Page</h1>
		</div>
	);
};
```

### **Sau:**

```typescript
const PhysicalBookDetailPage = () => {
	// State management
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	// API calls
	const { data: book } = useQuery({
		queryKey: ['book', id],
		queryFn: () => BooksAPI.getById(id!),
	});
	const { data: physicalCopiesData } = useQuery({
		queryKey: ['physical-copies-book', id],
		queryFn: () => PhysicalCopiesAPI.getByBook({ bookId: id! }),
	});

	// Mutations
	const createPhysicalCopyMutation = useMutation({
		/* ... */
	});
	const updateStatusMutation = useMutation({
		/* ... */
	});
	const updateConditionMutation = useMutation({
		/* ... */
	});

	return (
		<div className="container mx-auto p-6 space-y-6">
			<PhysicalDetailHeader />
			{/* Book Information */}
			<PhysicalListCard
				physicalCopies={physicalCopies}
				onCreateNew={handleCreateNew}
				onUpdateStatus={handleUpdateStatus}
				onUpdateCondition={handleUpdateCondition}
			/>
			<CreatePhysicalCopyDialog
				open={showCreateDialog}
				onOpenChange={setShowCreateDialog}
				bookId={id!}
				bookTitle={book?.title}
				onSubmit={handleCreatePhysicalCopy}
				isLoading={createPhysicalCopyMutation.isPending}
			/>
		</div>
	);
};
```

## 🔧 API Integration

### **1. Fetch Book Details**

```typescript
const { data: book } = useQuery({
	queryKey: ['book', id],
	queryFn: () => BooksAPI.getById(id!),
	enabled: !!id,
});
```

### **2. Fetch Physical Copies**

```typescript
const { data: physicalCopiesData } = useQuery({
	queryKey: ['physical-copies-book', id],
	queryFn: () => PhysicalCopiesAPI.getByBook({ bookId: id! }),
	enabled: !!id,
});
```

### **3. Create Physical Copy**

```typescript
const createPhysicalCopyMutation = useMutation({
	mutationFn: (data: CreatePhysicalCopyRequest) =>
		PhysicalCopiesAPI.create(data),
	onSuccess: () => {
		toast.success('Tạo bản sao thành công!');
		queryClient.invalidateQueries({ queryKey: ['physical-copies-book', id] });
		setShowCreateDialog(false);
	},
});
```

### **4. Update Status**

```typescript
const updateStatusMutation = useMutation({
	mutationFn: ({ copyId, status }: { copyId: string; status: CopyStatus }) =>
		PhysicalCopiesAPI.updateStatus(copyId, { status }),
	onSuccess: () => {
		toast.success('Cập nhật trạng thái thành công!');
		queryClient.invalidateQueries({ queryKey: ['physical-copies-book', id] });
	},
});
```

### **5. Update Condition**

```typescript
const updateConditionMutation = useMutation({
	mutationFn: ({
		copyId,
		condition,
	}: {
		copyId: string;
		condition: CopyCondition;
	}) => PhysicalCopiesAPI.updateCondition(copyId, { condition }),
	onSuccess: () => {
		toast.success('Cập nhật tình trạng thành công!');
		queryClient.invalidateQueries({ queryKey: ['physical-copies-book', id] });
	},
});
```

## 🎨 UI/UX Features

### **1. Status Management**

- **Available**: Sẵn sàng cho mượn (màu xanh)
- **Borrowed**: Đang được mượn (màu xanh dương)
- **Reserved**: Đã đặt trước (màu vàng)
- **Damaged**: Hư hỏng (màu đỏ)
- **Lost**: Mất (màu xám)
- **Maintenance**: Bảo trì (màu cam)

### **2. Condition Management**

- **New**: Mới (màu xanh)
- **Good**: Tốt (màu xanh dương)
- **Worn**: Cũ (màu vàng)
- **Damaged**: Hư hỏng (màu đỏ)

### **3. Visual Indicators**

```typescript
const getStatusIcon = (status: string) => {
	switch (status) {
		case 'available':
			return <CheckCircle className="h-4 w-4 text-green-500" />;
		case 'borrowed':
			return <BookOpen className="h-4 w-4 text-blue-500" />;
		case 'reserved':
			return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
		case 'damaged':
		case 'lost':
		case 'maintenance':
			return <AlertTriangle className="h-4 w-4 text-red-500" />;
		default:
			return <FileText className="h-4 w-4 text-gray-500" />;
	}
};
```

### **4. Data Formatting**

```typescript
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('vi-VN');
};

const formatPrice = (price: number) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(price);
};
```

## 📊 Form Fields

### **CreatePhysicalCopyDialog Fields:**

- **Barcode**: Text input (required)
- **Purchase Date**: Date picker (required)
- **Purchase Price**: Number input (required)
- **Location**: Text input (required)
- **Current Condition**: Select dropdown (new/good/worn/damaged)
- **Condition Details**: Textarea (optional)
- **Notes**: Textarea (optional)

## 🔍 Error Handling

### **1. Loading States**

```typescript
if (isLoadingBook || isLoadingCopies) {
	return (
		<div className="container mx-auto p-6 space-y-6">
			<Skeleton className="h-8 w-48" />
			<Skeleton className="h-64 w-full" />
		</div>
	);
}
```

### **2. Error States**

```typescript
if (bookError || copiesError) {
	return (
		<div className="container mx-auto p-6">
			<Alert variant="destructive">
				<AlertDescription>
					{(bookError || copiesError)?.message ||
						'Có lỗi xảy ra khi tải dữ liệu'}
				</AlertDescription>
			</Alert>
		</div>
	);
}
```

### **3. Toast Notifications**

- Success messages cho tất cả operations
- Error messages với chi tiết lỗi
- Loading states cho mutations

## 📁 Cấu trúc thư mục

```
src/pages/books/physical/[id]/
├── components/
│   ├── index.ts                    # Export all components
│   ├── physical-detail-header.tsx  # Header component
│   ├── physical-list-card.tsx      # Physical copies list
│   └── create-physical-copy-dialog.tsx # Create dialog
└── page.tsx                        # Main page (refactored)
```

## 🚀 Sử dụng Components

### **Import:**

```typescript
import {
	PhysicalDetailHeader,
	PhysicalListCard,
	CreatePhysicalCopyDialog,
} from './components';
```

### **Sử dụng:**

```typescript
// Header
<PhysicalDetailHeader />

// Physical copies list
<PhysicalListCard
  physicalCopies={physicalCopies}
  onCreateNew={handleCreateNew}
  onUpdateStatus={handleUpdateStatus}
  onUpdateCondition={handleUpdateCondition}
/>

// Create dialog
<CreatePhysicalCopyDialog
  open={showCreateDialog}
  onOpenChange={setShowCreateDialog}
  bookId={id!}
  bookTitle={book?.title}
  onSubmit={handleCreatePhysicalCopy}
  isLoading={createPhysicalCopyMutation.isPending}
/>
```

## ✅ Kết luận

Việc áp dụng logic cho trang physical book đã thành công:

- **4 components** được tạo và tách biệt
- **API integration** hoàn chỉnh với PhysicalCopiesAPI
- **Form validation** và error handling
- **Visual indicators** cho trạng thái và tình trạng
- **Toast notifications** cho user feedback
- **Loading states** và skeleton loading
- **Type safety** với CopyStatus và CopyCondition

Trang physical book giờ đây có đầy đủ tính năng quản lý bản sao vật lý! 🎉

---

**Last Updated**: 2024-01-01
**Status**: ✅ Completed
**Components Created**: 4
**API Integration**: ✅ PhysicalCopiesAPI
**Features**: ✅ CRUD operations, Status management, Condition management
