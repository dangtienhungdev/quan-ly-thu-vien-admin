import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import type { CreatePublisherRequest } from '@/types/publishers';
import { IconPlus } from '@tabler/icons-react';
import CreatePublisherForm from './create-publisher-form';

interface PublishersPageHeaderProps {
	onCreatePublisher: (data: CreatePublisherRequest) => void;
	onCreateSheetOpenChange: (open: boolean) => void;
	isCreateSheetOpen: boolean;
	isCreating: boolean;
}

const PublishersPageHeader = ({
	onCreatePublisher,
	onCreateSheetOpenChange,
	isCreateSheetOpen,
	isCreating,
}: PublishersPageHeaderProps) => {
	return (
		<div className="mb-2 flex items-center justify-between space-y-2">
			<h1 className="text-2xl font-bold tracking-tight">
				Quản lý nhà xuất bản
			</h1>
			<div className="flex items-center space-x-2">
				<Sheet open={isCreateSheetOpen} onOpenChange={onCreateSheetOpenChange}>
					<SheetTrigger asChild>
						<Button>
							<IconPlus className="mr-2 h-4 w-4" />
							Thêm nhà xuất bản
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-[400px] sm:w-[540px]">
						<SheetHeader>
							<SheetTitle>Thêm nhà xuất bản mới</SheetTitle>
						</SheetHeader>
						<div className="px-4">
							<CreatePublisherForm
								onSubmit={onCreatePublisher}
								onCancel={() => onCreateSheetOpenChange(false)}
								isLoading={isCreating}
							/>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
};

export default PublishersPageHeader;
