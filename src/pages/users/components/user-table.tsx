import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	formatDate,
	getReaderTypeDisplayName,
	getRoleBadgeVariant,
	getStatusBadgeVariant,
} from '@/utils/user-utils';
import { IconEdit, IconTrash } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Reader } from '@/types/readers';
import type { UserRole } from '@/types/user.type';
import { memo } from 'react';

interface User {
	id: string;
	userCode: string;
	username: string;
	email: string;
	role: UserRole;
	accountStatus: 'active' | 'inactive' | 'banned';
}

type UserOrReader = User | Reader;

interface UserTableProps {
	users: UserOrReader[];
	searchValue: string;
	onEditUser: (user: UserOrReader) => void;
	onDeleteUser: (user: {
		id: string;
		userCode: string;
		username: string;
	}) => void;
	isReaderView?: boolean;
}

export const UserTable = memo<UserTableProps>(
	({ users, searchValue, onEditUser, onDeleteUser, isReaderView = false }) => {
		if (users.length === 0) {
			return (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Mã người dùng</TableHead>
							<TableHead>Tên người dùng</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Quyền người dùng</TableHead>
							<TableHead>Trạng thái</TableHead>
							{isReaderView && <TableHead>Loại độc giả</TableHead>}
							{isReaderView && <TableHead>Ngày cấp thẻ</TableHead>}
							{isReaderView && <TableHead>Ngày hết hạn</TableHead>}
							<TableHead className="text-right">Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell
								colSpan={isReaderView ? 9 : 6}
								className="text-center py-8"
							>
								{searchValue
									? `Không tìm thấy người dùng nào phù hợp với "${searchValue}"`
									: 'Không có người dùng nào'}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			);
		}

		return (
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Mã người dùng</TableHead>
						<TableHead>Tên người dùng</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Quyền người dùng</TableHead>
						<TableHead>Trạng thái</TableHead>
						{isReaderView && <TableHead>Loại độc giả</TableHead>}
						{isReaderView && <TableHead>Ngày cấp thẻ</TableHead>}
						{isReaderView && <TableHead>Ngày hết hạn</TableHead>}
						<TableHead className="text-right">Hành động</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => {
						const isReader = isReaderView && 'readerType' in user;
						const reader = isReader ? (user as Reader) : null;

						return (
							<TableRow key={user.id}>
								<TableCell className="font-medium">
									{isReader ? reader?.cardNumber : (user as User).userCode}
								</TableCell>
								<TableCell>
									{isReader
										? reader?.fullName || 'N/A'
										: (user as User).username}
								</TableCell>
								<TableCell>
									{isReader
										? reader?.user?.email || 'N/A'
										: (user as User).email}
								</TableCell>
								<TableCell>
									<Badge
										variant={getRoleBadgeVariant(isReader ? 'reader' : 'admin')}
									>
										{isReader ? 'Độc giả' : 'Quản trị viên'}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge
										variant={getStatusBadgeVariant(
											isReader
												? reader?.isActive
													? 'active'
													: 'inactive'
												: (user as User).accountStatus
										)}
									>
										{isReader
											? reader?.isActive
												? 'Hoạt động'
												: 'Không hoạt động'
											: (user as User).accountStatus === 'active'
											? 'Hoạt động'
											: (user as User).accountStatus === 'inactive'
											? 'Không hoạt động'
											: 'Bị cấm'}
									</Badge>
								</TableCell>
								{isReaderView && (
									<>
										<TableCell>
											{getReaderTypeDisplayName(reader?.readerType)}
										</TableCell>
										<TableCell>
											{formatDate(reader?.cardIssueDate || '')}
										</TableCell>
										<TableCell>
											{formatDate(reader?.cardExpiryDate || '')}
										</TableCell>
									</>
								)}
								<TableCell className="text-right">
									<div className="flex justify-end space-x-1">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onEditUser(user)}
											className="h-8 w-8 p-0 text-primary hover:text-primary"
										>
											<IconEdit className="h-4 w-4" />
											<span className="sr-only">Chỉnh sửa người dùng</span>
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												onDeleteUser({
													id: user.id,
													userCode: isReader
														? reader?.user?.userCode || ''
														: (user as User).userCode,
													username: isReader
														? reader?.fullName || ''
														: (user as User).username,
												})
											}
											className="h-8 w-8 p-0 text-destructive hover:text-destructive"
										>
											<IconTrash className="h-4 w-4" />
											<span className="sr-only">Xóa người dùng</span>
										</Button>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		);
	}
);

UserTable.displayName = 'UserTable';
