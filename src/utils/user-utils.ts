import type { UserRole } from '@/types/user.type';

export const getRoleBadgeVariant = (role: string) => {
	switch (role) {
		case 'admin':
			return 'destructive';
		case 'user':
			return 'default';
		default:
			return 'secondary';
	}
};

export const getStatusBadgeVariant = (status: string) => {
	switch (status) {
		case 'active':
			return 'default';
		case 'inactive':
			return 'secondary';
		case 'banned':
			return 'destructive';
		default:
			return 'outline';
	}
};

export const getRoleDisplayName = (role: UserRole) => {
	switch (role) {
		case 'admin':
			return 'Quản trị viên';
		case 'reader':
			return 'Độc giả';
		default:
			return role;
	}
};

export const getStatusDisplayName = (status: string) => {
	switch (status) {
		case 'active':
			return 'Hoạt động';
		case 'inactive':
			return 'Không hoạt động';
		case 'banned':
			return 'Bị cấm';
		default:
			return status;
	}
};

export const getUserTypeLabel = (type: string) => {
	return type === 'admin' ? 'nhân viên' : 'người dùng';
};

export const formatDate = (dateString: string) => {
	if (!dateString) return 'N/A';
	const date = new Date(dateString);
	return date.toLocaleDateString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
};

export const getReaderTypeDisplayName = (readerType?: { typeName: string }) => {
	if (!readerType) return 'N/A';
	switch (readerType.typeName) {
		case 'student':
			return 'Sinh viên';
		case 'teacher':
			return 'Giáo viên';
		case 'staff':
			return 'Cán bộ';
		default:
			return readerType.typeName;
	}
};
