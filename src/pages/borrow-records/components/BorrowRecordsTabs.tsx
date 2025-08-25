import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { BorrowRecordsTable } from './BorrowRecordsTable';

interface BorrowRecordsTabsProps {
	status: string;
	onTabChange: (value: string) => void;
	records: any[];
	isLoading: boolean;
	onViewDetails: (record: any) => void;
	onApprove: (record: any) => void;
	onReturn: (record: any) => void;
	onRenew: (record: any) => void;
	onSendNotification: (record: any) => void;
	onDelete: (record: any) => void;
	onUpdateOverdue: (record: any) => void;
	onCreateFine: (record: any) => void;
	isApproving: boolean;
	isReturning: boolean;
	isRenewing: boolean;
	isSendingReminders: boolean;
	isDeleting: boolean;
	isUpdatingOverdue: boolean;
	isCreatingFine: boolean;
	shouldDisableApproveButton: (record: any) => boolean;
	approvedBooks: Record<string, boolean>;
}

export const BorrowRecordsTabs: React.FC<BorrowRecordsTabsProps> = ({
	status,
	onTabChange,
	records,
	isLoading,
	onViewDetails,
	onApprove,
	onReturn,
	onRenew,
	onSendNotification,
	onDelete,
	onUpdateOverdue,
	onCreateFine,
	isApproving,
	isReturning,
	isRenewing,
	isSendingReminders,
	isDeleting,
	isUpdatingOverdue,
	isCreatingFine,
	shouldDisableApproveButton,
	approvedBooks,
}) => {
	return (
		<Tabs value={status} onValueChange={onTabChange} className="space-y-4">
			<TabsList>
				{/* <TabsTrigger value="pending_approval">Chờ phê duyệt</TabsTrigger>  */}
				<TabsTrigger value="borrowed">Đang mượn</TabsTrigger>
				<TabsTrigger value="returned">Đã trả</TabsTrigger>
				<TabsTrigger value="renewed">Đã gia hạn</TabsTrigger>
				<TabsTrigger value="overdue">Quá hạn</TabsTrigger>
			</TabsList>

			<TabsContent value={status} className="space-y-4">
				<BorrowRecordsTable
					records={records}
					isLoading={isLoading}
					onViewDetails={onViewDetails}
					onApprove={onApprove}
					onReturn={onReturn}
					onRenew={onRenew}
					onSendNotification={onSendNotification}
					onDelete={onDelete}
					onUpdateOverdue={onUpdateOverdue}
					onCreateFine={onCreateFine}
					isApproving={isApproving}
					isReturning={isReturning}
					isRenewing={isRenewing}
					isSendingReminders={isSendingReminders}
					isDeleting={isDeleting}
					isUpdatingOverdue={isUpdatingOverdue}
					isCreatingFine={isCreatingFine}
					shouldDisableApproveButton={shouldDisableApproveButton}
					approvedBooks={approvedBooks}
					currentStatus={status}
				/>
			</TabsContent>
		</Tabs>
	);
};
