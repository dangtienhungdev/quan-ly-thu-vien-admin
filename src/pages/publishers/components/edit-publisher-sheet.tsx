import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import type { Publisher, UpdatePublisherRequest } from '@/types/publishers';

import EditPublisherForm from './edit-publisher-form';

interface EditPublisherSheetProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	publisherToEdit: Publisher | null;
	onUpdate: (data: UpdatePublisherRequest) => void;
	isUpdating: boolean;
}

const EditPublisherSheet = ({
	isOpen,
	onOpenChange,
	publisherToEdit,
	onUpdate,
	isUpdating,
}: EditPublisherSheetProps) => {
	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-[400px] sm:w-[540px]">
				<SheetHeader>
					<SheetTitle>
						Chỉnh sửa nhà xuất bản {publisherToEdit?.publisherName}
					</SheetTitle>
				</SheetHeader>
				<div className="px-4">
					{publisherToEdit && (
						<EditPublisherForm
							publisher={publisherToEdit}
							onSubmit={onUpdate}
							onCancel={() => onOpenChange(false)}
							isLoading={isUpdating}
						/>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default EditPublisherSheet;
